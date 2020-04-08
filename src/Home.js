import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-dates/initialize';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";
import {Auth} from "aws-amplify";
import Alert from 'react-bootstrap/Alert'




export default class Home extends Component {

    
  async  componentDidMount(){

      console.log(this.state.startDate);
      const poolData = {UserPoolId:process.env.REACT_APP_USER_POOL_ID, ClientId:process.env.REACT_APP_APP_CLIENT_ID};
      const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
      const cognitoUser = userPool.getCurrentUser();
      
      if (cognitoUser != null) {
      cognitoUser.getSession((err, session) => {
        if (err) {
          console.log(err);
        } else if (!session.isValid()) {
          console.log("Invalid session.");
        } else {
          console.log("IdToken: " + session.getIdToken().getJwtToken());
          this.setState({auth:true});
          try{
            axios({
              method: 'get',
              url: process.env.REACT_APP_API,
              headers: { 'Content-Type': 'application/json', 'Authorization': session.getIdToken().getJwtToken()}
            })
              .then(async response=> {
                if(response===undefined){
                  console.log('null')
                }
                 else{
                  await this.setState({user:response.data.body.username});
                  await this.setState({alltotal:response.data.body.totalexpense});
              
                await response.data.body.expense.forEach(async (res)=>{
                  let date = res.date;
                  let expensenames=res.expensenames.slice();
                  let expensevalues=res.expensevalues.slice();
                  let total=res.total;
                  let day= [date,expensenames,expensevalues,total].slice();
                  await this.setState({monthexpense:[...this.state.monthexpense,day]});
                  console.log(this.state.startDate);
                  console.log(date);
     //             await this.setState({startDate: date})
                  if(this.state.startDate.toString().substr(0, 15)===date.substr(0, 15)){
                    await this.setState({allexpense:expensenames});
                  await this.setState({expense:expensevalues});
                  await this.setState({total:total})}
                  
                })
              }
                await console.log(this.state.monthexpense);  
                await console.log(this.state.expense); 
                await console.log(this.state.expense); 
               })
          }catch(error)
          {
            console.log('error')
          }
           
  
        }
      });
      
    } else {
      console.log("User not found.");
    }
    }

    state={
        totalexpense:"",
        foodexpense:"",
        travelexpense:"",
        newexpense:"",
        allexpense:[],
        expense:[],
        key:"",
        total:null,
        realtotal:null,
        nan:null,
        dayexpense:[],
        monthexpense:[],
        resss:[],
        datearray:[],
        startDate: new Date(),
        expensearray:[],
        condition:null,
        alltotal:null,
        user:null,
        auth:false,
        change:false,
        show:false
    };

    handlechange=async event=>{
      await this.setState({
       [event.target.name]:event.target.value});
    };

    addexpense=async event => {
        event.preventDefault();
       await this.setState({change:true});
           await this.state.newexpense === "" ? this.setState({error:true}) : this.setState({error:false});
           if(this.state.error===false){
            await this.setState({
            expense:[...this.state.expense,""], allexpense:[...this.state.allexpense,this.state.newexpense]});
           }
           this.clearfeild(event);
        };
        
        clearfeild = event =>{
            event.preventDefault();
            document.getElementById("newexpense").value = "";
            this.setState({newexpense:""});
        }
        

    async change (e,index){
   //   e.preventDefault();
  //    await this.setState({change:true});
        this.state.expense[index] = e.target.value;
        this.setState({expense:this.state.expense});
        var res=this.state.expense.map(v=>parseFloat(v,10));
        var ress=res.filter(function(re){
          return isNaN(re)===false;
        });
       await this.setState({total:ress.reduce((accumulator,currentValue)=>accumulator+currentValue,0)});
       await this.setState({resss:ress});  
       await this.setState({change:true}); 
    };

    async remove(e,index){
        e.preventDefault();
       await this.setState({change:true});
       await this.state.allexpense.splice(index,1);
       await this.state.expense.splice(index,1);
       await this.setState({expense:this.state.expense, allexpense:this.state.allexpense}); 
       var res=this.state.expense.map(v=>parseFloat(v,10));
       var ress=res.filter(function(re){
       return isNaN(re)===false;
    });
     await this.setState({total:ress.reduce((accumulator,currentValue)=>accumulator+currentValue,0)});
     await this.setState({resss:ress});
    };

    
    handleChangedate = async date => {

        if(this.state.change===true) {
          console.log('chick on save expenses');
          this.setState({show:true})
          
        }
        
        else{

          await this.setState({
            startDate: date,
            condition:'false'
          });
          console.log(this.state.startDate);
           await this.state.monthexpense.forEach((day)=>{
             
                  day[0].substr(0, 15)===this.state.startDate.toString().substr(0, 15) ? 
                  this.setState({allexpense:day[1],expense:day[2],total:day[3],condition:'true'})    
                  : 
                  console.log('no data available')}) 
                  await console.log(this.state.condition);
                  await this.state.condition === 'true' ? await console.log("true true") :  this.setState({allexpense:[],expense:[],total:null})
  
                  await console.log(this.state.monthexpense);
                  await console.log(this.state.expense); 
                //  await this.setState({change:true})
       }
            };


logout = async event=>{
  event.preventDefault();
  try{
    Auth.signOut();
    this.props.history.push("/Login");
  }catch(error){

  }

}

  date = async event =>{
   event.preventDefault();
 this.setState({change:false})
  let newarray=[];
  let newarray1=[];
  let total1=0;
  let arraay0=this.state.startDate.toString();
  let arraay=this.state.allexpense.slice();
  let arraay1=this.state.resss.slice();
  let arraay2=this.state.total;

  await this.setState({dayexpense:[this.state.startDate.toString(),arraay,arraay1,arraay2]});
  this.state.monthexpense.forEach((day)=>{
     
    day[0].substr(0, 15)===this.state.startDate.toString().substr(0, 15)?  
    this.state.monthexpense.splice(this.state.monthexpense.indexOf(day),1): 
    console.log('nothing done')}) 

    await this.setState({monthexpense:[...this.state.monthexpense,this.state.dayexpense]});
    console.log(this.state.monthexpense);

    await this.state.monthexpense.forEach((day)=>{
      total1 +=day[3];
       console.log(day[3]);
       console.log(total1);
     })
     await this.setState({alltotal:total1})

    await this.state.monthexpense.forEach((day)=>{
      newarray={"date":day[0],"expensenames":day[1],"expensevalues":day[2],"total":day[3]};
      newarray1=[...newarray1,newarray];
    })
    const poolData = {UserPoolId:process.env.REACT_APP_USER_POOL_ID, ClientId:process.env.REACT_APP_APP_CLIENT_ID};
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser != null) {
    cognitoUser.getSession((err, session) => {
      if (err) {
        console.log(err);
      } else if (!session.isValid()) {
        console.log("Invalid session.");
      } else {
        console.log("IdToken: " + session.getIdToken().getJwtToken());

        axios({
          method: 'post',
          url:process.env.REACT_APP_API,
          headers: { 'Authorization': session.getIdToken().getJwtToken()},
          data: {
            
              
              "expense": newarray1,
              "totalexpense":total1
              }
    
          })
          .then(async response=> {
            await console.log(response)
           })

      }
    });
  } else {
    console.log("User not found.");
  }

       
        }

      fetch=async event=>{
        event.preventDefault();

        const poolData = {UserPoolId: process.env.REACT_APP_USER_POOL_ID, ClientId: process.env.REACT_APP_APP_CLIENT_ID};
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser != null) {
    cognitoUser.getSession((err, session) => {
      if (err) {
        console.log(err);
      } else if (!session.isValid()) {
        console.log("Invalid session.");
      } else {
        console.log("IdToken: " + session.getIdToken().getJwtToken());

         axios({
          method: 'get',
          url: process.env.REACT_APP_API,
          headers: { 'Content-Type': 'application/json', 'Authorization': session.getIdToken().getJwtToken()}
        })
          .then(async response=> {
              await this.setState({user:response.data.body.username});
          
            await response.data.body.expense.forEach(async (res)=>{
              let date = res.date;
              let expensenames=res.expensenames.slice();
              let expensevalues=res.expensevalues.slice();
              let total=res.total;
              let day= [date,expensenames,expensevalues,total].slice();
              await this.setState({monthexpense:[...this.state.monthexpense,day]});
            })
           })

      }
    });
  } else {
    console.log("User not found.");
  }
      }     

    render() {
        return (
   
<div>
<div> {this.state.auth ? <div style={{ display:'flex',flexDirection:"column",marginTop:'5vh'}}>
            <div style={{color:'yellow', textAlign:'center',paddingTop:'1vh',display:'flex',alignSelf:'center'}}>
              <div style={{marginRight:'2vh'}}>WELCOME</div>
              <div style={{fontWeight:'900',marginRight:'2vh'}}>{this.state.user}</div>
            <div>
            
            <button className="button" style={{color:'red',borderColor:'black',background:'rgba(0,0,0,0.7)','border-radius': '10%',padding:'2px 5px'}} onClick={this.logout}>LOGOUT</button>
            </div>

            <div className="home">
              <h3 style={{ color:'yellow', marginBottom:'1vh'}}> Expense Tracker</h3> 
              <div style={{ display:'flex',flexDirection:"column",alignItems:'center',justifyContent:'space-around'}}>
               <div className="date"> Select the date</div>
               
               <div className="datepicker">  <DatePicker 
                     selected={this.state.startDate}
                     onChange={this.handleChangedate}
                     />    </div>


          <div className="inputexpense">  
          <button className="button" style={{ background: 'none',color:'white','border-radius': '10%',padding:'2px 5px'}} onClick={this.date}>Save expense</button>
          </div>


         {this.state.change && this.state.show ? 
         <Alert variant="warning" onClose={() => this.setState({show:false})} dismissible>
        <Alert.Heading>Save your expense!</Alert.Heading>
        <p>
          PLease click on save expenses and save your expense before changing dates
        </p>
      </Alert> : null}



              </div>
            <div style={{marginBottom:'1vh',marginTop:'1vh'}}>
            <input className="buttoninput" id="newexpense" placeholder="ADD YOUR EXPENSE" name="newexpense" style={{ background: 'none', color:'white', textAlign:'center',marginTop:'1vh',marginBottom:'1vh' }} onChange={this.handlechange}/>
              
            </div>
                           		<button className="button"  style={{ background: 'none',margin:'2px 8px', color:'white','border-radius': '10%',width:'10vh', height:'6vh'}} onClick={this.addexpense}> 
                            		ADD
                            		</button>
                                    
                                    <div>
                                    <div>
                          {this.state.error? <div style={{marginTop:'2vh',marginBottom:'2vh'}}>PLease input your expense</div>: <div></div>}
                          </div>
                          </div>
             <div className="content" style={{ 'overflow-y': 'scroll'}}>
             
             {
                 this.state.expense.map((exp,index)=>{
                
                     return(
                      
                        <div key={index} style={{ display:'flex',width:'300px',alignItems:'center',justifyContent:'space-evenly'}}>
                          
                          <h5 style={{width:'230px',margin:'0px',overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis',alignSelf:'right'} }>
                               {this.state.allexpense[index]} </h5>

                          
                          <input className="buttoninput" style={{background:'none',width:'120px',margin:'2px 0px 2px 5px','border-radius': '10%', color:'white', textAlign:'center'}} 
                                value={exp} onChange={(e)=>this.change(e,index)} type="number" autoFocus/>
                          
                          <button className="button" style={{ background: 'none',margin:'5px 8px', color:'white','border-radius': '10%',padding:'2px 5px'}} 
                                onClick={(e)=>this.remove(e,index)}>
                           DELETE
                          </button>
                          
                        </div>
                        
                       
                        
                     )

                 })
             }
            
             </div>
             
        
             
             
              <div className="total">Expense Of The Day:<div className="sum">{this.state.total}  </div>BHD    </div> 

              <div className="total">Total Expenses :<div className="sum">{this.state.alltotal}  </div>BHD    </div> 
            </div>
            
            </div>
  </div>: <div style={{color:"red"}}>RESTRICTED PLEASE LOGIN</div>}</div>
  
</div>
        )
    }
}
