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
import { Video } from "expo-av";

const DetailsScreen = () => {
  const id = useNavigationParam("id");
  const title = useNavigationParam("name");
  const description = useNavigationParam("description");
  const collectionName = useNavigationParam("collectionName");

  const [expand, setExpand] = useState(false);
  const width = Dimensions.get("window").width;
  const { goBack, push } = useNavigation();
  const { state, actions } = useDetailsReducer(id);

  useEffect(() => {
    actions.loadRecord();
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
            {state.record.media.length > 0 ? (
              <Swiper height="100%">
                {state.record.media.map((e, i) => (
                  <View key={i.toString()} style={{ height: 255 }}>
                    {e.type?.includes("image") ||
                    e.type?.includes("application") ? (
                      <>
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
                            resizeMode: expand ? "cover" : "contain",
                            flex: 1,
                          }}
                          defaultSource={require("./../../assets/defaultImg.png")}
                        />
                        <FAB
                          testID="expand"
                          icon={
                            expand ? "arrow-expand-all" : "arrow-collapse-all"
                          }
                          onPress={() =>
                            expand ? setExpand(false) : setExpand(true)
                          }
                          style={styles.expandIcon}
                        />
                      </>
                    ) : e.type?.includes("audio") ||
                      e.type?.includes("video") ? (
                      <Video
                        useNativeControls
                        source={{
                          uri:
                            e["record"] != null
                              ? e["record"]["o:original_url"]
                              : null,
                        }}
                        style={{
                          width: width,
                          flex: 1,
                        }}
                        usePoster
                        posterSource={require("./../../assets/nodeDefault.png")}
                        resizeMode="contain"
                        rate={1.0}
                        volume={1.0}
                        isMuted={false}
                        resizeMode="cover"
                        shouldPlay
                        isLooping
                      />
                    ) : null}

                    <FavoriteFab
                      record={{
                        id,
                        name:title,
                        media:state.record.media,
                        description,
                        collectionName,
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
