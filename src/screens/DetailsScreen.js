import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  Modal,
  BackHandler,
} from "react-native";
import { Appbar, FAB, Paragraph, Title } from "react-native-paper";
import { useNavigation, useNavigationParam } from "react-navigation-hooks";

import useDetailsReducer from "../store/hooks/details";
import Spinner from "../components/Spinner";
import FavoriteFab from "../components/FavoriteFab";
import Divider from "../components/Divider";
import Swiper from "react-native-swiper";
import { Video } from "expo-av";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  TouchableHighlight,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import ImageViewer from "react-native-image-zoom-viewer";

const DetailsScreen = () => {
  const id = useNavigationParam("id");
  const title = useNavigationParam("name");
  const description = useNavigationParam("description");
  const collectionName = useNavigationParam("collectionName");
  const width = Dimensions.get("window").width;
  //  const { goBack, push } = useNavigation();
  const { state, actions } = useDetailsReducer(id);
  const [isModalOpened, setIsModalOpened] = useState(false);
  const { push, goBack } = useNavigation();

  function openModal(value) {
    setIsModalOpened(true);
  }

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
            <>
              <Modal
                visible={isModalOpened}
                transparent={true}
                onRequestClose={() => {
                  setIsModalOpened(false);
                }}
              >
                <ImageViewer
                  enableImageZoom={true}
                  enableSwipeDown={true}
                  imageUrls={state.record.media?.imageUrls}
                  onSwipeDown={() => {
                    setIsModalOpened(false);
                  }}
                />
              </Modal>
              <TouchableHighlight onPress={() => openModal(true)}>
                <Swiper height="100%">
                  {state.record.media?.imageUrls?.map((e, i) => (
                    <View key={i} style={{ height: 255 }}>
                      <Image
                        key={i}
                        source={{
                          uri: e["url"],
                        }}
                        style={{
                          width: width,
                          resizeMode: "contain",
                          flex: 1,
                        }}
                        defaultSource={require("./../../assets/defaultImg.png")}
                      />
                      <FavoriteFab
                        record={{
                          id,
                          name: title,
                          url: e["url"],
                          media: state.record.media,
                          description,
                          collectionName,
                        }}
                        style={styles.fab}
                      />
                    </View>
                  ))}
                </Swiper>
              </TouchableHighlight>
              {state.record.media.videoUrls?.map((e, i) => (
                <View key={i} style={{ height: 255 }}>
                  <Video
                    useNativeControls
                    source={{
                      uri: e,
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
                </View>
              ))}

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
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            flexWrap: "wrap",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                          }}
                        >
                          <Title>{prop.title}</Title>
                          {/* {prop.title == "Naziv zbirke" ? ( */}
                          <TouchableOpacity
                            testID="feed-item"
                            onPress={() =>
                              push("Main", {
                                filter: prop.value,
                                propertyId: prop.id,
                              })
                            }
                          >
                            <Text style={{ fontSize: 10 }}>
                              Prikaži sve slične
                            </Text>
                          </TouchableOpacity>
                          {/* ) : null} */}
                        </View>
                        <Paragraph>{prop.value || <Text>-</Text>}</Paragraph>
                        <Divider />
                      </View>
                    ))
                  : null}
              </View>
            </>
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
  link: {
    color: "#2e78b7",
  },
});

export default DetailsScreen;
