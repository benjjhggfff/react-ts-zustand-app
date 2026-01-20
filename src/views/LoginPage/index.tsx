import React, {useState} from "react";
import styles from './Login.module.scss';
import { Input } from 'antd';
import { UserOutlined , LockOutlined } from '@ant-design/icons';


export default function LoginPage() {
  const [curentForm, setCurrentForm] = useState<'login' | 'register'>('login');
  const switchForm=(curentForm: 'login' | 'register')=>{
    setCurrentForm(curentForm);
  }
  return(
    <div className={styles.LoginPage} >
      
      { curentForm==='login'&& (
  
      <section className={`${styles.LoginForm} ${curentForm === 'login' ? styles.FormActive : styles.FormInactive}`}>
        <h2 className={styles.Welcome}>WElCOME</h2>
        <div className={styles.InputWrap}>
        <div className={styles.Username}>  <Input type="text" placeholder="Username" style={{ backgroundColor: 'transparent', border: 'none' }} prefix={  <UserOutlined />} /></div>
        <div className={styles.Password}>  <Input type="password" placeholder="Password" style={{ backgroundColor: 'transparent' ,border: 'none' }}  prefix={<LockOutlined />}/></div>
        
            <div className={styles.Options}>
              <div className="">   
                
             <Input  className={styles.Remember} name='remember' value='Remember me' type='checkbox'>
              
              </Input>
          <a href="#">Remember me</a></div>
       
          <a href="#">Forgot password?</a>
        </div>
          <button>Login</button>
        </div>
        <div className={styles.SignUp}>
          Don't have an account? <a href="#" onClick={()=>setCurrentForm('register')} >Sign Up</a>
        </div>
      </section>)}

        <section className={`${styles.RegisterForm} ${curentForm === 'register' ? styles.FormActive : styles.FormInactive}`}>
        <h2 className={styles.Welcome}>SIGN UP</h2>
        <div className={styles.InputWrap}> </div>
        <div className={styles.Username}>  <Input type="text" placeholder="Username" style={{ backgroundColor: 'transparent', border: 'none' }} prefix={  <UserOutlined />} /></div>
        <div className={styles.Password}>  <Input type="password" placeholder="Password" style={{ backgroundColor: 'transparent' ,border: 'none' }}  prefix={<LockOutlined />}/></div>
        <div className={styles.Password}>  <Input type="password" placeholder="Confirm Password" style={{ backgroundColor: 'transparent' ,border: 'none' }}  prefix={<LockOutlined />}/></div>


          <button>Regeist</button>
             <div className={styles.SignUp}>
          Don't have an account? <a href="#" onClick={()=>setCurrentForm('login')} >Sign Up</a>
        </div>
      </section>
    </div>
  )
}