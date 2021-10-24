import React from "react";
import { View, StyleSheet } from "react-native";
import { Appbar, Paragraph, Headline, Divider } from "react-native-paper";

import Link from "../components/Link";

const AboutScreen = () => {
  return (
    <View style={styles.root}>
      <Appbar.Header>
        <Appbar.Content title="O nama" />
      </Appbar.Header>
      <View style={styles.content}>
        <View>
          <Headline style={styles.centeredText}>
            Aplikacija omogućava pregled dijela kulturnog naslijeđa, koji je
            dostupan i na web stranici{" "}
          </Headline>
          <Link url="https://muzej.info/s/muzej-rs/page/welcome">
            Muzeja Republike Srpske
          </Link>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.row}>
          <Headline style={styles.centeredText}>Izvorni kod </Headline>
          <Link url="https://github.com/MajaMihajlovic/museum-app">GitHub</Link>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.row}>
          <Paragraph style={styles.centeredText}> Autor </Paragraph>
          <Link url="https://github.com/MajaMihajlovic" Component={Paragraph}>
            Maja Mihajlovic
          </Link>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  divider: {
    width: "100%",
    padding: 1,
  },
  content: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    padding: 40,
  },
  centeredText: {
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
  },
  link: {
    color: "#2e78b7",
  },
});

export default AboutScreen;
