import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView, StyleSheet, Platform } from 'react-native'
import { WebView } from 'react-native-webview'

// Cambia esta URL por la IP local de tu ordenador cuando ejecutes npm run dev
// Ejemplo: http://192.168.1.100:3000
const APP_URL = Platform.select({
  ios: 'http://localhost:3000',
  android: 'http://10.0.2.2:3000', // Android emulator
  default: 'http://localhost:3000',
})

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <WebView
        source={{ uri: APP_URL }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        allowsBackForwardNavigationGestures={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F3',
  },
  webview: {
    flex: 1,
  },
})
