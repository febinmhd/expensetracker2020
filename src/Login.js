import React, { Component } from 'react'
import './App.css';
import {Auth} from "aws-amplify";
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";

import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Home from './Home';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './App.css';

export default class Login extends Component {

    state={
        username:"",
        password:"",
        email:"",
        screen:"about",
        confirmationcode:"",
        newpassword:"",
        loginerror:"",
        registererror:"",
        confirmerror:"",
    }

    handlechange=event=>{
        this.setState({
        [event.target.name]:event.target.value});
    };

    toggle= async event=>{
        event.preventDefault();
        await this.setState({screen:!this.state.screen});
        
    };

    loginsubmit= async event=>{
        event.preventDefault();
        try{
            const user=await Auth.signIn(this.state.username,this.state.password);
            this.props.history.push("/Home");
        }
        catch(error){
            await this.setState({loginerror:error.message})
        }
        
    };

    registersubmit= async event=>{
        event.preventDefault();
        const{username,password,email}=this.state;
        try{
            const signUpResponse=await Auth.signUp({
                username,
                password,
                attributes:{
                    email:email
                }
            });
            this.props.history.push("/Login");
        }
        catch(error){
            await this.setState({registererror:error.message})
        }
    };

    forgotpassword= async event=>{
        event.preventDefault();
      await this.setState({screen:"forgotpassword"});
    };

    sendcode= async event=>{
        event.preventDefault();
        try{
            await Auth.forgotPassword(this.state.email);
            await this.setState({screen:"confirmationcode"})

        }catch(error){
            console.log(error);
        }
    };

    confirmcode= async event=>{
        event.preventDefault();
        try{
            await Auth.forgotPasswordSubmit(this.state.email,this.state.confirmationcode,this.state.newpassword);
            await this.setState({screen:true})
        }catch(error){
            await this.setState({confirmerror:error.message});
        }
    };
    
    render() {

        if(this.state.screen==="about"){
            return (
              <div>
              <div className="home111" style={{padding:'0 2vw'}} >
              <button className="button" style={{ fontWeight:'900',background: 'none',margin:'20px 20px', color:'yellow','border-radius': '10%',padding:'2px 5px'}} onClick={()=>this.setState({screen:true})}>Register / Login and get started</button>
          
              <div style={{color:'yellow',fontWeight:'900',fontFamily:'Jura, sans-serif'}} >ABOUT THE PROJECT</div> 
             <div style={{color:'white',fontFamily:'Jura, sans-serif'}} > This Project is developed using ReactJS and AWS Services. An easy way to track your daily expenses and keep a record of it in the cloud and access it when needed. 
               The Sign Up, Login setup and user authentification is handled using Amazon Cognito Services. History of expenses of the user is stored in Amazon Dynamo db. The API
               calls to the Dynamo db are made through Amazon API Gateway and Serverless Lamda functions written in Node.js.</div> 
          
               <div style={{color:'yellow',fontWeight:'900',fontFamily:'Jura, sans-serif'}} >About Me</div>
          <div style={{color:'White',fontFamily:'Jura, sans-serif'}} > 
          <div>Febin Mohammed</div> 
              <div>febinmhd7@gmail.com</div> 
              <div> Manama</div> 
              <div> Bahrain</div> 
              <div> +97339886364</div> 
              </div>   
               </div>
               </div>
            )}



        
        if(this.state.screen===true){
        return (<div className="home" >
             Click here to {this.state.screen?(<button className="button" style={{ background: 'none',margin:'5px 8px', color:'white','border-radius': '10%',padding:'2px 5px'}} onClick={this.toggle}>Register</button>):
                (<button className="button" style={{ background: 'none',margin:'5px 8px', color:'white','border-radius': '10%',padding:'2px 5px'}} onClick={this.toggle}>Login</button>)}
             <h1 className="expense1" style={{color:'yellow'}} >Login</h1>
                    <form onSubmit={this.loginsubmit}>
                    <div>    Username/Email :<input className="buttoninput" style={{background:'none',width:'120px',margin:'2px 0px 2px 5px','border-radius': '10%', color:'white', textAlign:'center'}} id="username" type="text" name="username" value={this.state.username} onChange={this.handlechange}/></div>
                    <div>     Password : <input  className="buttoninput" style={{background:'none',width:'170px',margin:'2px 0px 2px 5px','border-radius': '10%', color:'white', textAlign:'center'}} id="password" type="password" name="password" value={this.state.password} onChange={this.handlechange}/></div>
                    <div>    
                        <button className="button" style={{ background: 'none',margin:'5px 8px', color:'white','border-radius': '10%',padding:'2px 5px'}} onClick={this.forgotpassword}>Forgot Password</button>
                        <button type="submit" className="button" style={{ background: 'none',margin:'5px 8px', color:'white','border-radius': '10%',padding:'2px 5px'}}>Login</button>
                        </div>
                    </form>
                    <div>{this.state.loginerror}</div>
        </div>)

        }
        else if(this.state.screen===false){
            return (<div className="home" >
                 Click here to {this.state.screen?(<button className="button" style={{ background: 'none',margin:'5px 8px', color:'white','border-radius': '10%',padding:'2px 5px'}} onClick={this.toggle}>Register</button>):
                (<button className="button" style={{ background: 'none',margin:'5px 8px', color:'white','border-radius': '10%',padding:'2px 5px'}} onClick={this.toggle}>Login</button>)}
                <h1 className="expense1" style={{color:'yellow'}}>Register</h1>
                <form onSubmit={this.registersubmit}>
                <div>   Username :<input className="buttoninput" style={{background:'none',width:'120px',margin:'2px 0px 2px 5px','border-radius': '10%', color:'white', textAlign:'center'}} id="username" type="text" name="username" value={this.state.username} onChange={this.handlechange}/></div> 
                <div>   Email :<input className="buttoninput" style={{background:'none',width:'155px',margin:'2px 0px 2px 5px','border-radius': '10%', color:'white', textAlign:'center'}} id="email" name="email" value={this.state.email} onChange={this.handlechange}/></div> 
                <div>   Password : <input className="buttoninput" style={{background:'none',width:'120px',margin:'2px 0px 2px 5px','border-radius': '10%', color:'white', textAlign:'center'}} id="password" type="password" name="password" value={this.state.password} onChange={this.handlechange}/></div> 
                <div style={{ marginLeft:'60px'}}><button className="button" style={{ background: 'none',margin:'5px 8px', color:'white','border-radius': '10%',padding:'2px 5px',alignSelf:'center'}} type="submit">Register</button></div> 
                </form>
                <div>{this.state.registererror}</div>
        <div style={{color:'yellow'}}>PLease check your inbox to confirm user</div>
            </div>)
        }
        else if(this.state.screen==="forgotpassword"){
            return (
                <div className="home"> 
                    Click here to <button className="button" style={{ background: 'none',margin:'5px 8px', color:'white','border-radius': '10%',padding:'2px 5px'}} onClick={()=>this.setState({screen:true})}>Login</button>
                   <h1 className="expense1" style={{color:'yellow'}}>Forgot Password</h1> 
                    <form>
                <div>   Username/Email :<input className="buttoninput" style={{background:'none',width:'157px',margin:'2px 0px 2px 5px','border-radius': '10%', color:'white', textAlign:'center'}} id="email" name="email" value={this.state.email} onChange={this.handlechange}/></div> 
                
                <div style={{ marginLeft:'45px'}}><button className="button" style={{background: 'none',margin:'5px 8px', color:'white','border-radius': '10%',padding:'2px 5px'}} type="submit" onClick={this.sendcode}>Send Confirmation Code</button></div>
                    </form>
                    </div>
            )}

            else if(this.state.screen==="confirmationcode"){
                return (
                    <div className="home" > 
                        Click here to <button className="button" style={{ background: 'none',margin:'5px 8px', color:'white','border-radius': '10%',padding:'2px 5px'}} onClick={()=>this.setState({screen:true})}>Login</button>
                       <h3 className="expense1" style={{color:'yellow'}}>Change your password</h3> 
                        <form>
                    <div>  Username/Email :<input id="email"  style={{background:'none',width:'95px',margin:'2px 0px 2px 5px','border-radius': '10%', color:'white', textAlign:'center'}} name="email" value={this.state.email} onChange={this.handlechange}/></div>  
                    <div>    Confirmation Code :<input className="buttoninput" style={{background:'none',width:'80px',margin:'2px 0px 2px 5px','border-radius': '10%', color:'white', textAlign:'center'}} id="confirmationcode" type="text" name="confirmationcode" value={this.state.confirmationcode} onChange={this.handlechange}/>  </div>   
                   
                    <div>    Password : <input className="buttoninput" style={{background:'none',width:'143px',margin:'2px 0px 2px 5px','border-radius': '10%', color:'white', textAlign:'center'}} id="newpassword" type="password" name="newpassword" value={this.state.newpassword} onChange={this.handlechange}/></div>  
                    <div style={{ marginLeft:'50px'}}>  <button className="button" style={{ background: 'none',margin:'5px 8px', color:'white','border-radius': '10%',padding:'2px 5px'}} type="submit" onClick={this.confirmcode}>Reset Password</button></div>
                        </form>
                        <div>{this.state.confirmerror}</div>
                        </div>
                )}

    }
}
