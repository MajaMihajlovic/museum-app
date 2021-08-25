import React, { useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { Appbar, Paragraph, Title } from "react-native-paper";
import Swiper from "react-native-swiper";
import { useNavigation, useNavigationParam } from "react-navigation-hooks";

import useDetailsReducer from "../store/hooks/details";
import Spinner from "../components/Spinner";
import FavoriteFab from "../components/FavoriteFab";
import Divider from "../components/Divider";

const DetailsScreen = () => {
  const id = useNavigationParam("id");
  const title = useNavigationParam("name");
  const description = useNavigationParam("description");
  const primaryimageurl = useNavigationParam("primaryimageurl");

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
        <Appbar.Content title={title} subtitle={description} />
      </Appbar.Header>
      <ScrollView style={styles.content}>
        {state.loading ? (
          <Spinner />
        ) : state.error ? (
          <Text style={styles.body}>{state.error}</Text>
        ) : (
          <React.Fragment>
            <View style={styles.image}>
              <Swiper>
                {state.record.images.map((uri) => (
                  <Image key={uri} source={{ uri }} style={styles.image} />
                ))}
              </Swiper>
              <FavoriteFab
                record={{
                  id,
                  title,
                  primaryimageurl,
                  description,
                }}
                style={styles.fab}
              />
            </View>
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

              {/* <Title>People</Title>
              {state.record.people ? (
                state.record.people.map((p) => (
                  <TouchableOpacity
                    testID="push-details-screen"
                    key={p.personid + p.role}
                    onPress={() => push("Person", { ...p })}
                  >
                    <Paragraph>
                      <Paragraph style={styles.link}>{p.name}</Paragraph> (
                      {p.role})
                    </Paragraph>
                  </TouchableOpacity>
                ))
              ) : (
                <Text>-</Text>
              )}
              <Divider /> */}

              {state.record.properties
                ? state.record.properties.map((prop) => (
                    <>
                      <Title>{prop.title}</Title>
                      <Paragraph>{prop.value || <Text>-</Text>}</Paragraph>
                      <Divider />
                    </>
                  ))
                : null}
            </View>
          </React.Fragment>
        )}
      </ScrollView>
    </View>
  );
};

const width = Dimensions.get("window").width;

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
  image: {
    width: width,
    height: width * 1.5,
    resizeMode: "contain",
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
