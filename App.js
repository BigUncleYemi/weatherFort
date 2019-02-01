import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  ImageBackground,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

// You can import from local files
import SearchInput from './components/SearchInput';
import getImageForWeather from './utils/getImageForWeather';
import { fetchWeather, fetchCurrentLocationId, fetchSearchWeather } from './utils/api';
import SplashScreen from 'react-native-splash-screen';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: '',
      temperature: '',
      weather: '',
      pic: '',
      loading: false,
      error: false,
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition( (position) => {
        const lattlong = {
          latt: position.coords.latitude,
          long: position.coords.longitude
        };
        this.getCurrentLocation(lattlong);
        SplashScreen.hide();
      },
      (error) => this.handleUpdateLocation('ibadan'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 },
      SplashScreen.hide()
    );
  }

  getCurrentLocation = async lattlong => {
    if (!lattlong) return;
    this.setState({ loading: true }, async () => {
      try {
        const locationId = await fetchCurrentLocationId(lattlong);
        const { location, weather, temperature } = await fetchWeather(
          locationId
        );
        this.setState({
          loading : false,
          error : false,
          location,
          weather,
          temperature,
        });
      } catch (e) {
        this.handleUpdateLocation('Lagos')
      }
    });
  }

 handleUpdateLocation = async city => {
    if (!city) return;
    this.setState({ loading: true }, async () => {
      try {
        const { location, weather, temperature, pic } = await fetchSearchWeather(
          city
        );
        this.setState({
          loading: false,
          error: false,
          location,
          weather,
          temperature,
          pic,
        });
      } catch (e) {
        this.setState({
          loading: false,
          error: true,
        });
      }
    });
  };

  render() {
    const { location, weather, pic, temperature, loading, error } = this.state;

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <StatusBar barStyle="light-content" />
        <ImageBackground
          source={getImageForWeather(pic || weather)}
          style={styles.imageContainer}
          imageStyle={styles.image}>
          <View style={styles.detailsContainer}>
            <ActivityIndicator animating={loading} color="white" size="large" />
            {!loading && (
              <View>
                {error && (
                  <Text style={[styles.smallText, styles.textStyle]}>
                    Could not load weather, please try a different city.
                  </Text>
                )}
                {!error && (
                  <View>
                    <Text style={[styles.largeText, styles.textStyle]}>
                      {location}
                    </Text>
                    <Text style={[styles.smallText, styles.textStyle]}>
                      {weather}
                    </Text>
                    <Text style={[styles.largeText, styles.textStyle]}>
                      {`${Math.round(temperature)}°`}
                    </Text>
                  </View>
                )}
              </View>
            )}
            <SearchInput
              placeholder="Search any city"
              onSubmit={this.handleUpdateLocation}
            />
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34495E',
  },
  textStyle: {
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'Roboto',
    color: 'white',
  },
  largeText: {
    fontSize: 44,
  },
  smallText: {
    fontSize: 18,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 20,
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
});

SearchInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};
SearchInput.defaultProps = {
  placeholder: '',
};