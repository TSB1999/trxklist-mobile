import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  RefreshControl,
  Text,
  Image,
  Button,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Modal,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ImageBackground,
} from "react-native";

import Post from "../components/Post";
import UserStore from "../stores/UserStore";
import { observer } from "mobx-react";
import axios from "axios";
import StickyItemFlatList from "@gorhom/sticky-item";
import * as Animatable from "react-native-animatable";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { TabView, SceneMap } from "react-native-tab-view";
import { Picker } from "@react-native-picker/picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import spotifyAPI from "../components/SpotifyAPI";
import Body from "../components/post-components/Body";
import Footer from "../components/post-components/Footer";

let trackQuery = {};

const initialLayout = { width: Dimensions.get("window").width };

function Main() {
  const [trackDetails, setTrackDetails] = React.useState({});
  const [caption_prev, setCaption_prev] = React.useState("");
  const [openPostScreen, setOpenPostScreen] = React.useState(false);
  const handleStickyItemPress = () => setOpenPostScreen(true);
  const [selectedValue, setSelectedValue] = React.useState("track");
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Content" },
    { key: "second", title: "Caption" },
    { key: "third", title: "Preview" },
  ]);

  let data = [];
  // dummy data
  UserStore.followingDetails
    .map((user) => {
      data.push(user.image);
    })
    .fill(0)
    .map((_, index) => ({ id: `item-${index}` }));
  console.log(data);

  // configs
  const ITEM_WIDTH = 100;
  const ITEM_HEIGHT = 100;
  const STICKY_ITEM_WIDTH = 24;
  const STICKY_ITEM_HEIGHT = 24;
  const STICKY_ITEM_BACKGROUNDS = ["#222", "#000"];
  const SEPARATOR_SIZE = 8;
  const BORDER_RADIUS = 30;

  const StickyItemView = ({
    x,
    threshold,
    itemWidth,
    itemHeight,
    stickyItemWidth,
    stickyItemHeight,
    separatorSize,
    isRTL,
  }) => {
    const amazingAnimation = {
      // here you add your custom interactive animation
      // based on the animated value `x`
    };

    return (
      <Animatable.View style={amazingAnimation}>
        <ImageBackground
          source={{ uri: UserStore.spotifyUserDetails.user_image }}
          style={{
            width: 65,
            height: 65,
            alignItems: "center",
            justifyContent: "center",
          }}
          imageStyle={{ borderRadius: 30 }}
        >
          <FontAwesome
            name="plus-circle"
            size={65}
            style={{
              // color: "#1DB954",
              // padding: 4,
              // alignSelf: "center",
              borderRadius: 20,
              opacity: 0.75,
            }}
          />
        </ImageBackground>
      </Animatable.View>
    );
  };

  const renderItem = ({ item, index }) => (
    <ImageBackground
      key={`item-${index}`}
      source={{ uri: data[index] }}
      style={{
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
      }}
      imageStyle={{ borderRadius: 30 }}
    ></ImageBackground>
  );

  const renderItemSticky = ({ item, index }) => (
    <ImageBackground
      key={`item-${index}`}
      source={{ uri: data[index] }}
      style={{
        width: 65,
        height: 65,
      }}
      imageStyle={{ borderRadius: 30 }}
    ></ImageBackground>
  );
  const select = (item) => {
    setTrackDetails(item);
    setIndex(1);
    // console.log(item);
  };
  let recentPostsMarkup = UserStore.allPosts ? (
    UserStore.allPosts.map((post) => (
      <View
        style={{ marginBottom: 10, borderRadius: 15, paddingHorizontal: 10 }}
      >
        <Post key={post.postID} post={post} />
      </View>
    ))
  ) : (
    <Text>Loading</Text>
  );

  const FirstRoute = () => {
    const [queryList, setQueryList] = React.useState([]);
    const [data, setData] = React.useState({
      track: "",
    });

    const handleTrackChange = (val) => {
      setData({ ...data, track: val });
    };

    const search = (query) => {
      setQueryList([]);
      spotifyAPI.searchTracks(query).then(
        (data) => {
          // console.log(data);
          data.tracks.items.map((item) => {
            trackQuery = {
              id: item.id,
              name: item.name,
              artist: item.artists[0].name,
              artistID: item.artists[0].id,
              albumName: item.album.name,
              image: item.album.images[0].url,
              releaseDate: item.album.release_date,
              popularity: item.popularity,
              duration: item.duration_ms,
            };
            setQueryList((oldArray) => [...oldArray, trackQuery]);
          });
          // setQuery(...query, trackQuery);

          // console.log(queryList);
        },
        function (err) {
          console.error(err);
        }
      );
    };

    const select = (item) => {
      setTrackDetails(item);
      setIndex(1);
      // console.log(item);
    };

    let track_s = queryList ? (
      queryList.map((item) => (
        <TouchableOpacity onPress={() => select(item)}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ marginTop: 2, marginRight: 2 }}>
              <Image
                source={{ uri: item.image }}
                style={{ height: 100, width: 100 }}
              />
            </View>
            <View style={styles.track}>
              <Text style={styles.track}>{item.name}</Text>
              <Text
                style={{
                  color: "grey",
                  backgroundColor: "#fff",
                  padding: 5,
                }}
              >
                {item.artist}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))
    ) : (
      <Text>Loading</Text>
    );

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.action}>
          <View style={{ margin: 20, flex: 3 }}>
            <TextInput
              placeholder="Search for music"
              autoCapitalize="none"
              onChangeText={(val) => handleTrackChange(val)}
            />
          </View>

          <View style={{ flex: 1, marginRight: 5 }}>
            <TouchableOpacity onPress={() => search(data.track)}>
              <LinearGradient
                colors={["#1DB954", "green"]}
                style={styles.signIn}
              >
                <MaterialCommunityIcons name="spotify" color="#fff" size={20} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.block}>
          <ScrollView>{track_s}</ScrollView>
        </View>
      </View>
    );
  };

  const SecondRoute = () => {
    const [caption, setCaption] = React.useState("");
    const handleCaptionChange = (val) => {
      setCaption({ ...caption, caption: val });
      console.log(caption.caption);
      // setCaption_prev(caption);
    };
    const finalize = (caption) => {
      setCaption_prev(caption.caption);
      setIndex(2);
      console.log(caption.caption);
    };
    return (
      <View style={[styles.scene, { backgroundColor: "#007bff" }]}>
        <View
          style={{
            flexDirection: "row",
            borderBottomWidth: 1,
            borderBottomColor: "#fff",
            borderRadius: 10,
          }}
        >
          <View style={{ margin: 5 }}>
            <Image
              source={{ uri: UserStore.spotifyUserDetails.user_image }}
              style={{
                height: 70,
                width: 70,
                borderRadius: 70,
                borderWidth: 2,
                borderColor: "#fff",
              }}
            />
          </View>
          <TextInput
            placeholder="Caption your post"
            autoCapitalize="none"
            value={caption}
            // multiline="true"
            // numberOfLines={4}
            onChangeText={(val) => handleCaptionChange(val)}
            style={{
              padding: 10,
              backgroundColor: "white",
              borderRadius: 5,
              width: 250,
              height: 120,
              margin: 5,
              borderWidth: 3,
              borderColor: "#fff",
            }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            borderRadius: 10,
            alignSelf: "flex-end",
            marginTop: 10,
            bottom: 85,
            position: "absolute",
            borderBottomWidth: 1,
            borderBottomColor: "#fff",
          }}
        >
          <View style={{ alignItems: "flex-end", margin: 5 }}>
            <Text style={styles.track}>{trackDetails.name}</Text>
            <Text style={styles.track_inv}>{trackDetails.artist}</Text>
          </View>
          <View style={{ margin: 5 }}>
            <Image
              source={{ uri: trackDetails.image }}
              style={{
                height: 80,
                width: 80,
                borderRadius: 5,
                borderWidth: 2,
                borderColor: "#fff",
              }}
            />
          </View>
        </View>

        <TouchableOpacity
          style={{
            bottom: 10,
            position: "absolute",
            width: "80%",
            alignSelf: "center",
            borderWidth: 3,
            borderRadius: 15,
            borderColor: "#fff",
          }}
          onPress={() => finalize(caption)}
        >
          <LinearGradient colors={["#21295c", "#007bff"]} style={styles.signIn}>
            {/* <MaterialCommunityIcons name="spotify" color="#fff" size={20} /> */}
            <Text style={[styles.textSign, { color: "#fff" }]}>Finalize</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  const ThirdRoute = () => {
    const makePost = (post) => {
      axios
        .post(
          "https://europe-west1-projectmelo.cloudfunctions.net/api/post",
          post,
          {
            headers: {
              Authorization: `Bearer ${UserStore.authCode}`, //the token is a variable which holds the token
            },
          }
        )
        .then((res) => {
          // console.log(res.data);
          axios
            .get(
              "https://europe-west1-projectmelo.cloudfunctions.net/api/posts"
            )
            .then((res) => {
              console.log(res.data);
              UserStore.allPosts = res.data;
              //navigate home
            })
            .catch((err) => console.log(err));

          // UserStore.thisTrack = [];
          // UserStore.trackLoaded = false;
        })
        .catch((err) => console.log(err));
    };
    return (
      <View style={[styles.scene, { backgroundColor: "#ff" }]}>
        {/* <Header
          imageUri={UserStore.spotifyUserDetails.user_image}
          name={UserStore.userDetails.credentials.meloID}
        /> */}
        <Body
          thisTrack={trackDetails}
          caption={caption_prev}
          status={"Track"}
          imageUri={UserStore.spotifyUserDetails.user_image}
        />
        <Footer
          likesCount={0}
          commentCount={0}
          postID={"uuidv4()"}
          status={"Track"}
          trackID={trackDetails.id}
        />

        <TouchableOpacity
          style={{
            bottom: 5,
            position: "absolute",
            width: "80%",
            alignSelf: "center",
            borderWidth: 3,
            borderRadius: 15,
            borderColor: "#fff",
          }}
          onPress={() =>
            makePost({
              trackID: trackDetails.id,
              spotifyID: UserStore.spotifyUserDetails.user_id,
              body: caption_prev,
              status: "Track",
            })
          }
        >
          <LinearGradient colors={["#21295c", "#007bff"]} style={styles.signIn}>
            {/* <MaterialCommunityIcons name="spotify" color="#fff" size={20} /> */}
            <Text style={[styles.textSign, { color: "#fff" }]}>Post</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  if (!openPostScreen) {
    return (
      <View style={{ backgroundColor: "black", flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <ParallaxScrollView
            backgroundColor="black"
            contentBackgroundColor="black"
            parallaxHeaderHeight={80}
            renderStickyHeader={() => (
              <View style={{ padding: 5 }}>
                <StickyItemFlatList
                  itemWidth={65}
                  itemHeight={65}
                  separatorSize={SEPARATOR_SIZE}
                  borderRadius={BORDER_RADIUS}
                  stickyItemWidth={STICKY_ITEM_WIDTH}
                  stickyItemHeight={STICKY_ITEM_HEIGHT}
                  stickyItemBackgroundColors={STICKY_ITEM_BACKGROUNDS}
                  stickyItemContent={StickyItemView}
                  onStickyItemPress={handleStickyItemPress}
                  data={data}
                  renderItem={renderItemSticky}
                />
              </View>
            )}
            stickyHeaderHeight={75}
            // renderBackground = {0}
            // renderForeground={() => (
            //   <View style={{ padding: 5 }}>
            //     <StickyItemFlatList
            //       itemWidth={ITEM_WIDTH}
            //       itemHeight={ITEM_HEIGHT}
            //       separatorSize={SEPARATOR_SIZE}
            //       borderRadius={BORDER_RADIUS}
            //       stickyItemWidth={STICKY_ITEM_WIDTH}
            //       stickyItemHeight={STICKY_ITEM_HEIGHT}
            //       stickyItemBackgroundColors={STICKY_ITEM_BACKGROUNDS}
            //       stickyItemContent={StickyItemView}
            //       onStickyItemPress={handleStickyItemPress}
            //       data={data}
            //       renderItem={renderItem}
            //     />
            //   </View>
            // )}
          >
            <View style={{ paddingTop: 10 }}>
              <LinearGradient
                colors={["#000", "#8D8D92", "#292928", "#8D8D92", "#000"]}
              >
                <View>{recentPostsMarkup}</View>
                {/* explore */}
              </LinearGradient>
            </View>
          </ParallaxScrollView>
        </SafeAreaView>
      </View>
    );
  } else {
    const renderScene = SceneMap({
      first: FirstRoute,
      second: SecondRoute,
      third: ThirdRoute,
    });
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Button title="go back" onPress={() => setOpenPostScreen(false)} />
          <Picker
            selectedValue={selectedValue}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedValue(itemValue)
            }
            style={{ backgroundColor: "whitesmoke", borderRadius: 20 }}
          >
            <Picker.Item label="Lyric" value="lyric" />
            <Picker.Item label="Playlist" value="playlist" />
            <Picker.Item label="Track" value="track" />
            <Picker.Item label="Album" value="album" />
            <Picker.Item label="Artist" value="artist" />
          </Picker>
        </View>
        <View style={styles.footer}>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
          />
        </View>
      </View>
    );
  }
}

export default observer(Main);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#007bff",
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 25,
    paddingTop: 50,
  },
  footer: {
    flex: 1.9,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    // paddingHorizontal: 20,
    // paddingVertical: 30,
  },
  scene: {
    flex: 1,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  track: {
    marginTop: 2,
    marginRight: 2,
    padding: 10,
    backgroundColor: "#007bff",
    fontSize: 15,
    fontWeight: "bold",
    color: "#fff",
    width: "100%",
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});
