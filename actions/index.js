import Clarifai from 'clarifai';
import Exponent from 'expo';
import Firebase from 'firebase';
import uuidv4 from 'uuid/v4';

const CLIENT_ID = 'vNVG_tBb4NQaCyy8HQ-PM9xEhRCsfOelP4Fxa7Ju';
const CLIENT_SECRET = 'KFKXKBRINsy25OirQc4fOQ-61HAtzS8rmFk8jvEY';


// MARK: Action Variables

var config = {
    apiKey: "AIzaSyAIRoHUAOzmXbWnc0sfgEFqcKC8ldPW76U",
    authDomain: "fonty-166bc.firebaseapp.com",
    databaseURL: "https://fonty-166bc.firebaseio.com",
    projectId: "fonty-166bc",
    storageBucket: "fonty-166bc.appspot.com",
    messagingSenderId: "817465186798"
};

var app = new Clarifai.App(
    CLIENT_ID,
    CLIENT_SECRET
);

var userDB = Exponent.SQLite.openDatabase({
    name: 'user.db'
});

// MARK: Reducer Actions

export const setImage = (image) => ({
    type: 'SET_IMAGE',
    image: image
});

export const setFinds = (finds) => ({
    type: 'SET_FINDS',
    finds: finds
});

export const startEvaluating = () => ({
    type: 'START_EVALUATING'
});

export const initialized = () => ({
    type: 'INITIALIZED'
});

// MARK: User Actions

export const initializeApp = () => {
    return function (dispatch) {
        if (!Firebase.apps.length) {
            Firebase.initializeApp(config);
        }

        // write id to phone if there is not already a value there
        userDB.transaction(tx => {
            tx.executeSql(
                'create table if not exists user (id integer primary key not null, uuid integer);'
            );
        });

        dispatch(getUUID());
    }
};

export const fetchUUID = (tag) => {
    return function (dispatch) {
        userDB.transaction(tx => {
            tx.executeSql('select * from user', [], (_, { rows }) =>
                dispatch(writeFind(rows._array[0]['uuid'], tag))
            )
        });
    }
};
export const getUUID = () => {
    return function (dispatch) {
        userDB.transaction(tx => {
            tx.executeSql('select * from user', [], (_, { rows }) =>
                (rows._array.length === 0 ? dispatch(createUUID()) : dispatch(fetchFinds(rows._array[0]['uuid'])))
            );
        });
    }
};

export const createUUID = () => {
    return function (dispatch) {
        var id = uuidv4();
        console.log('CREATED UID: ' + id);
        dispatch(writeUUID(id));
    }
};

export const writeUUID = (id) => {
    return function (dispatch) {
        userDB.transaction(
            tx => {
                tx.executeSql('insert into user (uuid) values (?)', [id]);
            }
        );

        dispatch(fetchFinds(id));
    }
};

// MARK: Firebase Actions

export const fetchFinds = (id) => {
    return function (dispatch) {
        // use uuid to query past finds from firebase and load the list view

        Firebase.database().ref('users/' + id).on('value', (snapshot) => {
            setTimeout(() => {
                const finds = snapshot.val() || [];
                dispatch(setFinds(finds));
            }, 0);
        });

        dispatch(initialized());
    }
};

export const uploadImage = (id, tag) => {
    return function (dispatch) {
        dispatch(writeFind(id, tag));
    }
};

export const writeFind = (id, tag) => {
    return function (dispatch) {
        // write tag with uploaded image url to id in firebase
        let find = {
            tag: tag
        };

        const newFindRef = Firebase.database().ref('users/' + id).push();
        find.id = newFindRef.key;
        newFindRef.set(find);

        dispatch(fetchFinds(id));
    }
};

// MARK: Image Analysis Actions

export const evaluateImage = (urlString) => {
    return function (dispatch) {
        dispatch(startEvaluating());

        console.log('made it');

        app.models.predict(Clarifai.GENERAL_MODEL, { url: urlString }).then(
            (res) => {
                console.log('Clarifai response = ', res);
                dispatch(fetchUUID(res.data.outputs[0].data.concepts[0].name));
            },
            (error)=>{
                console.log('error: ', error);
            }
        );
    }
};

export const pickImage = ()  => {
    // when user chooses a picture upload that to firebase storage

    return async function (dispatch) {
        let result = await Exponent.ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3]
        });

        // write the location to their user in firebase

        dispatch(setImage(result.uri.replace('file://', '')));
        dispatch(evaluateImage('https://cdnimg.fonts.net/CatalogImages/23/164771.png'));
    }
};

export const takePhoto = ()  => {
    // when user chooses a picture upload that to firebase storage

    return async function (dispatch) {
        let result = await Exponent.ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3]
        });

        // write the location to their user in firebase

        dispatch(setImage(result.uri.replace('file://', '')));
        dispatch(evaluateImage('https://cdnimg.fonts.net/CatalogImages/23/164771.png'));
    }
};

// MARK: Clarifai Training Actions

export function train() {
    app.inputs.create([{
        "url": "http://www.designer-daily.com/wp-content/uploads/2008/11/times-new-roman-specimen.png",
        "concepts": [
            { "id": "Times New Roman", "value": true },
            { "id": "Arial", "value": false }
        ]
    }, {
        "url": "https://img2.embroiderydesigns.com/Font/XLarge/Fireside_Threads/fst0143.jpg",
        "concepts": [
            { "id": "Times New Roman", "value": false },
            { "id": "dog", "value": true }
        ]
    }, {
        "url": "https://samples.clarifai.com/cat1.jpeg",
        "concepts": [
            { "id": "cat", "value": true },
            { "id": "dog", "value": false }
        ]
    }, {
        "url": "https://samples.clarifai.com/cat2.jpeg",
        "concepts": [
            { "id": "cat", "value": true },
            { "id": "dog", "value": false }
        ]
    }]).then(
        createModel,
        errorHandler
    );
}

// once inputs are created, create model by giving name and list of concepts
function createModel(inputs) {
    app.models.create('fonts', ["Times New Roman", "Arial"]).then(
        trainModel,
        errorHandler
    );
}

// after model is created, you can now train the model
function trainModel(model) {
    model.train().then(
        predictModel,
        errorHandler
    );
}

// after training the model, you can now use it to predict on other inputs
function predictModel(model) {
    model.predict(['https://samples.clarifai.com/dog3.jpeg', 'https://samples.clarifai.com/cat3.jpeg']).then(
        function(response) {
            console.log(response);
        }, errorHandler
    );
}

function errorHandler(err) {
    console.error(err);
}