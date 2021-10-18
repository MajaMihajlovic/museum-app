import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
  Image,
} from "react-native";
import { Appbar, FAB, Paragraph, Title } from "react-native-paper";
import { useNavigation, useNavigationParam } from "react-navigation-hooks";

import useDetailsReducer from "../store/hooks/details";
import Spinner from "../components/Spinner";
import FavoriteFab from "../components/FavoriteFab";
import Divider from "../components/Divider";
import Swiper from "react-native-swiper";
import Video from "react-native-video";

const DetailsScreen = () => {
  const id = useNavigationParam("id");
  const title = useNavigationParam("name");
  const description = useNavigationParam("description");
  const collectionName = useNavigationParam("collectionName");
  const media = useNavigationParam("media");
  const [expand, setExpand] = useState(false);

  const getHeigth = async () => {
    if (media != []) {
      let url = media[0]["record"]["o:thumbnail_urls"]?.large;
      await Image.getSize(url, (_, height) => {
        if (height) setHeight(height);
      });
    }
  };
  const width = Dimensions.get("window").width;

  const { goBack, push } = useNavigation();
  const [height, setHeight] = useState(false);

  const { state, actions } = useDetailsReducer(id);
  useEffect(() => {
    actions.loadRecord();

    if (media[0]?.thumbnailUrl) getHeigth();
  }, []);

  return (
    <View style={styles.root} testID="details-screen">
      <Appbar.Header>
        <Appbar.BackAction
          testID="go-back-details-screen"
          onPress={() => goBack()}
        />
        <Appbar.Content title={title} subtitle={collectionName} />
      </Appbar.Header>
      <ScrollView style={styles.content}>
        {state.loading ? (
          <Spinner />
        ) : state.error ? (
          <Text style={styles.body}>{state.error}</Text>
        ) : (
          <React.Fragment>
            {media.length > 0 ? (
              <Swiper height={width}>
                {media.map((e, i) => (
                  <View key={i}>
                    {e["type"] == "image/jpeg" || e["type"] == undefined ? (
                      <Image
                        key={e["record"]["o:id"]}
                        source={{
                          uri:
                            e["record"] != null
                              ? e["record"]["o:thumbnail_urls"]?.large
                              : e.thumbnailUrl,
                        }}
                        style={{
                          width: width,
                          resizeMode: expand ? "contain" : "cover",
                          height: width,
                        }}
                        defaultSource={require("./../../assets/defaultImg.png")}
                      />
                    ) : // </ImageBackground>
                    // ) : e.type == "audio/x-wav" || e.type == "video/mp4" ? (
                    //   <Video
                    //     source={{
                    //       uri:
                    //         e["record"] != null
                    //           ? e["record"]["original_url"]
                    //           : null,
                    //     }} // Can be a URL or a local file.
                    //     // ref={(ref) => {
                    //     //   this.player = ref;
                    //     // }} // Store reference
                    //     //  onBuffer={this.onBuffer} // Callback when remote video is buffering
                    //     //  onError={this.videoError} // Callback when video cannot be loaded
                    //     style={{
                    //       width: width,
                    //       height: width,
                    //     }}
                    //   />
                    null}

                    <FAB
                      testID="expand"
                      icon={expand ? "arrow-expand-all" : "arrow-collapse-all"}
                      onPress={() =>
                        expand ? setExpand(false) : setExpand(true)
                      }
                      style={styles.expandIcon}
                    />
                    <FavoriteFab
                      record={{
                        id,
                        title,
                        media,
                        description,
                      }}
                      style={styles.fab}
                    />
                  </View>
                ))}
              </Swiper>
            ) : null}
            <View style={styles.body}>
              <Title>ID</Title>
              <Paragraph>{id}</Paragraph>
              <Divider />

              <Title>Naziv</Title>
              <Paragraph>{title}</Paragraph>
              <Divider />
              <Title>Opis</Title>
              <Paragraph>{description}</Paragraph>
              <Divider />

              {state.record.properties
                ? state.record.properties.map((prop, i) => (
                    <View key={i}>
                      <Title>{prop.title}</Title>
                      <Paragraph>{prop.value || <Text>-</Text>}</Paragraph>
                      <Divider />
                    </View>
                  ))
                : null}
            </View>
          </React.Fragment>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "black",
  },
  content: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: "white",
  },
  body: {
    flex: 1,
    padding: 16,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  expandIcon: {
    position: "absolute",
    margin: 16,
    right: 70,
    bottom: 0,
  },
  link: {
    color: "#2e78b7",
  },
});

export default DetailsScreen;
