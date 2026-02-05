import {configureStore} from '@reduxjs/toolkit';
import loginReduers from './modules/userStore';


const store = configureStore({
    reducer: {
        userStore: loginReduers,
    }
});
export default store;