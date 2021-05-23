import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default class TransactionScreen extends React.Component {
    constructor(){
      super();
      this.state = {
        hasCameraPermissions: null,
        scanned: false,
        scannedBookId: '',
        buttonState: 'normal',
        scannedStudentId: '',
      }
    }

    getCameraPermissions = async (id) =>{
      const {status} = await Permissions.askAsync(Permissions.CAMERA);
      
      this.setState({
        /*status === "granted" is true when user has granted permission
          status === "granted" is false when user has not granted the permission
        */
        hasCameraPermissions: status === "granted",
        buttonState: id,
        scanned: false
      });
    }

    handleBarCodeScanned = async({type, data})=>{
      const {buttonState} = this.state
      if(buttonState === 'bookId'){
        this.setState({
        scanned: true,
        scannedBookId: data,
        buttonState: 'normal'
        });
      }
      else if(buttonState === 'studentId'){
        this.setState({
          scanned: true,
          scannedStudentId: data,
          buttonState: 'normal',
        })
      }
      
    }

    render() {
      const hasCameraPermissions = this.state.hasCameraPermissions;
      const scanned = this.state.scanned;
      const buttonState = this.state.buttonState;

      if (buttonState !== "normal" && hasCameraPermissions){
        return(
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        );
      }

      else if (buttonState === "normal"){
        return(
          <View style={styles.container}>
            <View>
              <Image
                source = {require('../assets/mainBook.jpg')}
                style = {{width:200, height:200}}
              />
              <Text>Wily App</Text>
            </View>
            <View style={styles.inputView}>
              <TextInput
                placeholder = "Book ID"
                value = {this.state.scannedBookId}
              />
              <TouchableOpacity 
                style={styles.scanButton} 
                onPress = {()=>{
                  this.getCameraPermissions('bookId')
                }}
              >
                <Text> Scan Book ID</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputView}>
              <TextInput
                placeholder = "Student ID"
                value = {this.state.scannedStudentId}
              />
              <TouchableOpacity
               style={styles.scanButton}
               onPress= {()=>{
                 this.getCameraPermissions('studentId')
               }}
              >
                <Text> Scan Student ID</Text>
              </TouchableOpacity>
            </View>

          </View>
        );
      }
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    displayText:{
      fontSize: 15,
      textDecorationLine: 'underline'
    },
    scanButton:{
      backgroundColor: '#2196F3',
      padding: 10,
      margin: 10
    },
    buttonText:{
      fontSize: 20,
    },
    inputView:{
      flexDirection:'row',
      margin:20
    }
  });