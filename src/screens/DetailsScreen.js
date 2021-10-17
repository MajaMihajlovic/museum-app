import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
  Image,
} from "react-native";
import { Appbar, Paragraph, Title } from "react-native-paper";
import { useNavigation, useNavigationParam } from "react-navigation-hooks";

import useDetailsReducer from "../store/hooks/details";
import Spinner from "../components/Spinner";
import FavoriteFab from "../components/FavoriteFab";
import Divider from "../components/Divider";

const DetailsScreen = () => {
  const id = useNavigationParam("id");
  const title = useNavigationParam("name");
  const description = useNavigationParam("description");
  const collectionName = useNavigationParam("collectionName");
  const media = useNavigationParam("media");

  const getHeigth = async () => {
    try {
      await Image.getSize(mediaUrl, (_, height) => {
        if (height) setHeight(height);
      });
    } catch (e) {
      console.log("unable to load image");
      console.log(media);
    }
  };
  const width = Dimensions.get("window").width;

  const { goBack, push } = useNavigation();
  const [height, setHeight] = useState(false);
  const [mediaUrl, setMediaUrl] = useState(null);

  const { state, actions } = useDetailsReducer(id);
  useEffect(() => {
    actions.loadRecord();
    setMediaUrl(
      media["record"] != null
        ? media["record"]["o:thumbnail_urls"]?.large
        : media.thumbnailUrl
    );
    if (mediaUrl) getHeigth();
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
            {media?.thumbnailUrl ? (
              <View id={id}>
                {/* <Swiper> */}

                <Image
                  key={media}
                  source={{
                    uri: mediaUrl,
                  }}
                  style={{
                    width: width,
                    resizeMode: "contain",
                    height: height > width ? width : height,
                  }}
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
