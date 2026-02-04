import {configureStore} from '@reduxjs/toolkit';
import loginReduers from './modules/loginStore';


const store = configureStore({
    reducer: {
        login: loginReduers,
    }
});
export default store;