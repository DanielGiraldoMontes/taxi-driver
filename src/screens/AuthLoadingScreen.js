import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import * as firebase from 'firebase'
import GetPushToken from '../common/GetPushToken/';
import { Notifications } from 'expo';
import  languageJSON  from '../common/language';
import { Audio } from 'expo-av';

export class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync =  () => {
    firebase.auth().onAuthStateChanged((user)=>{
        console.log('user',user)
        if(user && user.displayName){
          const userData=firebase.database().ref('users/'+user.uid);
          userData.once('value',userData=>{
            if(userData.val()) {
              if(userData.val().usertype == 'driver' && userData.val().approved == true){
                this.props.navigation.navigate('DriverRoot');
                GetPushToken();
               }
               else if(userData.val().approved == false) {
                firebase.auth().signOut();
                alert(languageJSON.driver_account_approve_err);
               }
               else{ 
                firebase.auth().signOut();
                alert(languageJSON.account_not_exsist);
               }
            }
          })
        }else{
          this.props.navigation.navigate('Auth');
        }
    })
  };

  componentDidMount(){
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }
  
 _handleNotification = async (notification) => {
    alert(notification.data.msg);
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(require('../../assets/sounds/car_horn.wav'));
      await soundObject.playAsync();
    } catch (error) {
      console.log("Unable to play sound");
    }
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.IndicatorStyle}>
        <ActivityIndicator />
      </View>
    );
  }
}

//style for this component
const styles = StyleSheet.create({
  IndicatorStyle:{
    flex:1, 
    justifyContent:"center"
  }
})