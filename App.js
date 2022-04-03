import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

import {request, PERMISSIONS} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';

import api from './src/services/api';

const App = () => {
  const language = 'pt_br';
  const API_key = '7482195e1117b31368a113a9a2594fea';
  const [data, setData] = useState([]);
  const [weatherData, setWeatherData] = useState(false);

  const locationPermition = async () => {
    try {
      let result = await request(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );

      if (result === 'granted') {
        return true;
      } else {
        Alert.alert('Permissão negada');
        return false;
      }
    } catch (error) {
      Alert.alert(error);
      return false;
    }
  };

  const handleLocationFinder = async () => {
    if (locationPermition) {
      Geolocation.getCurrentPosition(
        info => {
          api
            .get(
              `weather?lat=${info.coords.latitude}&lon=${info.coords.longitude}&appid=${API_key}&lang=${language}&units=metric`,
            )
            .then(response => {
              setData(response.data);
              setWeatherData(true);
            })
            .catch(err => {
              Alert.alert('Erro: ' + err);
            });
        },
        error =>
          Alert.alert(
            'Erro',
            'Nenhuma localização está disponível, verifique se o seu gps está ligado',
          ),

        {
          accuracy: {
            android: 'high',
            ios: 'best',
          },
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 0,
        },
      );
    }
  };

  useEffect(() => {
    handleLocationFinder();
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.mainContainer}>
        {weatherData && (
          <View style={styles.sectionContainer}>
            <View style={styles.screenTitleCard}>
              <Text style={styles.screenTitleTitle}>Clima em {data.name}</Text>
            </View>

            <View style={styles.imageTempContainer}>
              <View style={styles.imagecontainer}>
                <Image
                  style={styles.tempImage}
                  source={{
                    uri: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
                  }}
                />
              </View>
              <Text style={styles.imageTempTitle}>
                {data.weather[0].description}
              </Text>
              <Text style={styles.imageTempDescription}>
                {data.main.temp.toFixed(1)}º
              </Text>
            </View>
            <View style={styles.maximaMinimaContainer}>
              <View style={styles.maximaMinimaCard}>
                <Text style={styles.minMaxTitle}>Mínima:</Text>
                <Text style={styles.maxMinText}>
                  {data.main.temp_min.toFixed(1)}º
                </Text>
              </View>
              <View style={styles.maximaMinimaCard}>
                <Text style={styles.minMaxTitle}>Máxima:</Text>
                <Text style={styles.maxMinText}>
                  {data.main.temp_max.toFixed(1)}º
                </Text>
              </View>
            </View>
          </View>
        )}
        <View style={styles.sectionContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLocationFinder}>
            <Text  style={styles.buttonText}>Atualizar dados</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#71f1eb',
    minHeight: '100%',
    justifyContent: 'center',
  },

  maximaMinimaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  imageTempContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingTop: 16,
    paddingBottom: 16,
    borderRadius: 24,
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
    marginBottom: 16,
  },
  imageTempTitle: {
    fontSize: 24,
    color: '#fff',
  },
  imageTempDescription: {
    color: '#fff',
    marginTop: 8,
    fontSize: 64,
    fontWeight: '700',
  },
  screenTitleCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingTop: 16,
    paddingBottom: 16,
    borderRadius: 24,
    alignItems: 'center',
    width: '100%',
  },
  screenTitleTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  maximaMinimaCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 24,
    width: '49%',
  },
  minMaxTitle: {
    color: '#fff',
    fontSize: 32,
    marginBottom: 12,
  },
  maxMinText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
  },
  sectionContainer: {
    alignContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionButton: {
    alignContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,  
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 10,
    width: 200,
    height: 70,
    borderRadius: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  tempImage: {
    width: 150,
    height: 100,
    resizeMode: 'cover',
  },
});

export default App;
