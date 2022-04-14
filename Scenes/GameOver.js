import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ImageBackground,
  useWindowDimensions,
  Platform,
  Share
} from "react-native";
import { connect } from "react-redux";
import MilkyWay from "../Images/milkyway.jpg";
import DriveInForeground from "../Images/drive-in-movie-foreground.png";
import AppLoading from "expo-app-loading";
import { useFonts, Limelight_400Regular } from "@expo-google-fonts/limelight";
import { Audio } from "expo-av";
import lose from "../Sounds/lose.wav";

function GameOver({ setScene, winningStreak, resetWinningStreak, resetSelectedMovie }) {
  const { width, height } = useWindowDimensions();
  const shareMessage = `I got a streak of 🎞️${winningStreak} in Trivia & Chill! Test your movie knowledge here: URL HERE`;
  const screenWrapTopPosition = {
    marginTop: width * 0.025 > 16 ? width * 0.025 : 16,
  };

  const [sound, setSound] = useState();
  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(lose);
    setSound(sound);

    await sound.playAsync();
  }

  const backToStartHandler = () => {
    resetWinningStreak();
    setScene("Main");
    resetSelectedMovie();
  };

  const shareScoreMobile = async () => {
    try {
      const result = await Share.share({
        message: shareMessage,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const shareScoreWeb = async () => {
    try {
      await navigator.clipboard.writeText(shareMessage);
      alert("Message copied to clipboard!");
    }
    catch (error) {
      alert(error.message);
    }
  };

  let [fontsLoaded] = useFonts({
    Limelight_400Regular,
  });

  useEffect(() => {
    playSound();
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <View style={styles.layout}>
        <Image
          source={MilkyWay}
          style={[styles.milkywaybg, { marginBottom: (height - 40) * -1 }]}
          resizeMode="cover"
        ></Image>
        <Image
          source={DriveInForeground}
          style={styles.driveinforeground}
        ></Image>
        <View style={[styles.screenWrap, screenWrapTopPosition]}>
          <Text style={styles.gameOverStyle}>Game Over</Text>
          <View style={styles.buttonRow}>
            { winningStreak > 0 && Platform.OS !=="web" &&
            <Pressable style={styles.buttonStyle} onPress={shareScoreMobile}>
              <ImageBackground
                  source={require("../Images/ticket.png")}
                  style={styles.ticket}
                >
                <Text style={styles.backToStartButtonText}>Share Score</Text>
              </ImageBackground>
            </Pressable>
            }
            { winningStreak > 0 && Platform.OS ==="web" &&
            <Pressable style={styles.buttonStyle} onPress={shareScoreWeb}>
              <ImageBackground
                  source={require("../Images/ticket.png")}
                  style={styles.ticket}
                >
                <Text style={styles.backToStartButtonText}>Share Score</Text>
              </ImageBackground>
            </Pressable>
            }
            <Pressable style={styles.buttonStyle} onPress={backToStartHandler}>
              <ImageBackground
                source={require("../Images/ticket.png")}
                style={styles.ticket}
              >
                <Text style={styles.backToStartButtonText}>Start Over</Text>
              </ImageBackground>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    winningStreak: state.winningStreak,
    scene: state.scene,
    selectedMovie: state.selectedMovie,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    resetWinningStreak: () =>
      dispatch({
        type: "RESET_WINNING_STREAK",
      }),
    setScene: (name) =>
      dispatch({
        type: "SET_SCENE",
        name,
      }),
    resetSelectedMovie: (selectedMovie) =>
      dispatch({
        type: "RESET_SELECTED_MOVIE",
        selectedMovie,
      }),
  };
}

const styles = StyleSheet.create({
  layout: {
    backgroundColor: "black",
    height: "100%",
  },
  milkywaybg: {
    width: "100%",
    height: "60%",
  },
  driveinforeground: {
    position: "absolute",
    top: 20,
    resizeMode: "contain",
    width: Platform.OS !== "web" ? 650 : "100%",
    minWidth: 650,
    height: "auto",
    alignSelf: "center",
    aspectRatio: 468 / 485,
  },
  screenWrap: {
    position: "absolute",
    top: 20,
    backgroundColor: "#292840",
    padding: 20,
    width: "49.1%",
    minWidth: 320,
    aspectRatio: 714 / 391,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    zIndex: 1000,
    marginLeft: -2,
  },
  gameOverStyle: {
    fontSize: 28,
    marginBottom: Platform.OS !== "web" ? 20 : 70,
    textAlign: "center",
    fontFamily: "Limelight_400Regular",
    color: "#F2D379",
  },
  backToStartButtonText: {
    textAlign: "center",
    fontSize: 14,
    color: "#401323",
    marginBottom: 5,
  },
  ticket: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonStyle: {
    width: "35%",
    minWidth: 120,
    minHeight: 62,
    aspectRatio: 7.8 / 4,
    marginRight: 5,
  },
  buttonRow: {
    flexDirection: "row",
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(GameOver);
