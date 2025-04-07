export const getAuth = jest.fn(() => ({
  onAuthStateChanged: jest.fn((callback) => {
    callback(null);
    return jest.fn();
  }),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn()
}));

export const getFirestore = jest.fn(() => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn()
}));

export const getStorage = jest.fn(() => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn()
}));

export const getMessaging = jest.fn(() => ({
  getToken: jest.fn(),
  onMessage: jest.fn()
}));

export const initializeApp = jest.fn(); 