import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  Button,
  Dimensions,
  TextInput,
  Text,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

import UserStore from "../stores/UserStore";
import { observer } from "mobx-react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import StickyItemFlatList from "@gorhom/sticky-item";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import { LinearGradient } from "expo-linear-gradient";
import { TabView, SceneMap } from "react-native-tab-view";
import { Picker } from "@react-native-picker/picker";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const {
  first_route,
  second_route,
  third_route,
  sticky_item_view,
  recent_posts_markup,
  render_tab_bar,
} = require("../handlers/main");
const initialLayout = { width: Dimensions.get("window").width };

function Main() {
  const [caption, setCaption] = React.useState("");
  const [pickerHeader, setPickerHeader] = React.useState(true);
  const [captionHeader, setCaptionHeader] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState("track");
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Content" },
    { key: "second", title: "Caption" },
    { key: "third", title: "Preview" },
  ]);

  const handleStickyItemPress = () => (UserStore.enablePostScreen = true);
  const handleCaptionChange = (val) => setCaption(val);

  let data = [];
  UserStore.followingDetails
    .map((user) => data.push(user.image))
    .fill(0)
    .map((_, index) => ({ id: `item-${index}` }));

  // configs
  const ITEM_WIDTH = 65;
  const ITEM_HEIGHT = 65;
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
  }) => sticky_item_view();

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

  let recentPostsMarkup = recent_posts_markup();

  const FirstRoute = first_route;

  const SecondRoute = () => second_route(caption);

  const ThirdRoute = () => third_route(caption);

  if (!UserStore.enablePostScreen) {
    return (
      <View style={{ backgroundColor: "#292929", flex: 1 }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#292929", borderBottomColor : '#fff', borderBottomWidth : 2 }}>
          <ParallaxScrollView
            backgroundColor="#292929"
            contentBackgroundColor="#292929"
            parallaxHeaderHeight={95}
            renderStickyHeader={() => (
              <View
                style={{
                  padding: 5,
                  marginLeft: 10,
                  marginRight: 10,
                  marginBottom: 10,
                  backgroundColor: "#272D2D",
                  borderWidth: 0,
                  borderColor: "#fff",
                  borderRadius: 15,
                  minHeight: 80,
                  borderBottomWidth : 3,
                }}
              >
                <StickyItemFlatList
                  itemWidth={ITEM_WIDTH}
                  itemHeight={ITEM_HEIGHT}
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
            stickyHeaderHeight={90}
            // renderBackground = {0}
            renderForeground={() => (
              <View
                style={{
                  padding: 5,
                  marginLeft: 10,
                  marginRight: 10,
                  marginBottom: 10,
                  backgroundColor: "#272D2D",
                  borderWidth: 0,
                  borderColor: "green",
                  borderRadius: 15,
                  minHeight: 80,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 1, marginRight: 5 }}>
                  <TouchableOpacity onPress={() => search(data.track)}>
                    <LinearGradient
                      colors={["#272D2D", "#272D2D"]}
                      style={styles.signIn}
                    >
                      <FontAwesome
                        name="plus-circle"
                        size={30}
                        style={{
                          color: "#fff",
                          // padding: 4,
                          // alignSelf: "center",
                          borderRadius: 20,
                          opacity: 0.75,
                        }}
                      />
                      <Text style = {{color : '#fff'}}>Post</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1, marginRight: 5 }}>
                  <TouchableOpacity onPress={() => search(data.track)}>
                    <LinearGradient
                      colors={["#272D2D", "#272D2D"]}
                      style={styles.signIn}
                    >
                      <MaterialCommunityIcons
                        name="circle"
                        color="#fff"
                        size={50}
                      />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1, marginRight: 5 }}>
                  <TouchableOpacity onPress={() => search(data.track)}>
                    <LinearGradient
                      colors={["#272D2D", "#272D2D"]}
                      style={styles.signIn}
                    >
                      <FontAwesome
                        name="inbox"
                        size={30}
                        style={{
                          color: "#fff",
                          // padding: 4,
                          // alignSelf: "center",
                          borderRadius: 20,
                          opacity: 0.75,
                        }}
                      />
                      <Text style = {{color : '#fff'}}>Inbox</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          >
            <View style={{ paddingTop: 10 }}>
              <LinearGradient
                colors={["#292929", "#292929", "#292929", "#292929", "#292929"]}
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

    const renderTabBar = (props) => render_tab_bar(props);

    const onIndexChange = (index) => {
      setIndex(index);
      if (index == 0) {
        setPickerHeader(true);
        setCaptionHeader(false);
      } else if (index == 1) {
        setPickerHeader(false);
        setCaptionHeader(true);
      } else {
        setPickerHeader(false);
        setCaptionHeader(false);
      }
    };
    return (
      <LinearGradient
        colors={["#000", "#292928", "#000"]}
        style={{ flex: 1, paddingHorizontal: 10 }}
      >
        {captionHeader == false && pickerHeader == true ? (
          <View style={[styles.header, { backgroundColor: "#000" }]}>
            <Button
              title="return"
              onPress={() => {
                UserStore.enablePostScreen = false;
                setCaption("");
              }}
            />
            <Picker
              selectedValue={selectedValue}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedValue(itemValue)
              }
              style={{
                backgroundColor: "whitesmoke",
                borderRadius: 20,
                flex: 1,
              }}
            >
              <Picker.Item label="Lyric" value="lyric" />
              <Picker.Item label="Playlist" value="playlist" />
              <Picker.Item label="Track" value="track" />
              <Picker.Item label="Album" value="album" />
              <Picker.Item label="Artist" value="artist" />
            </Picker>
          </View>
        ) : captionHeader == true && pickerHeader == false ? (
          <View style={[styles.header, { backgroundColor: "#000" }]}>
            <Button
              title="return"
              onPress={() => {
                UserStore.enablePostScreen = false;
                setCaption("");
              }}
            />
            <Image
              source={{ uri: UserStore.spotifyUserDetails.user_image }}
              style={{
                height: 50,
                width: 50,
                borderRadius: 30,
                alignSelf: "center",
              }}
            />
            <View style={{ marginBottom: 3 }} />
            <TextInput
              placeholder="Caption your post"
              autoCapitalize="none"
              value={caption}
              // multiline="true"
              onChangeText={(val) => handleCaptionChange(val)}
              style={{
                padding: 20,
                justifyContent: "center",
                backgroundColor: "#292929",
                borderRadius: 20,
                margin: 5,
                borderWidth: 3,
                flex: 1,
                textAlign: "center",
                fontSize: 30,
              }}
            />
          </View>
        ) : captionHeader == true && pickerHeader == false ? null : null}
        <SafeAreaView style={styles.footer}>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={(index) => onIndexChange(index)}
            initialLayout={initialLayout}
            renderTabBar={renderTabBar}
          />
        </SafeAreaView>
      </LinearGradient>
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
    backgroundColor: "#292929",
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
    backgroundColor: "#000",
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
