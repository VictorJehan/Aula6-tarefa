import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const firebaseConfig = {
  apiKey: "AIzaSyAHuk_Mh0RL67A7m9ZwElq81qPsJ_oesLo",
  authDomain: "aelielfirebase.firebaseapp.com",
  projectId: "aelielfirebase",
  storageBucket: "aelielfirebase.firebasestorage.app",
  messagingSenderId: "855115445436",
  appId: "1:855115445436:web:c370ebec595f3c361d8cb9",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function App() {
  return (
    <View style={styles.webContainer}>
      <View style={styles.appWrapper}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Cadastro" component={Cadastro} />
            <Stack.Screen name="TelaPrincipal" component={TelaPrincipal} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </View>
  );
}

function Cadastro({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const cadastrar = () => {
    if (!email || !senha)
      return Alert.alert("Erro", "Preencha todos os campos!");
    createUserWithEmailAndPassword(auth, email, senha)
      .then(() => {
        Alert.alert("Sucesso", "Conta criada!");
        navigation.replace("TelaPrincipal");
      })
      .catch(() => setErro("Erro ao cadastrar"));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f7fa" }}>
      <View style={styles.container}>
        <Text style={styles.titulo}>Criar Conta</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
        {erro ? <Text style={styles.errorText}>{erro}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={cadastrar}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.linkText}>Já tem conta? Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const login = () => {
    if (!email || !senha) return setErro("Preencha todos os campos");
    signInWithEmailAndPassword(auth, email, senha)
      .then(() => navigation.replace("TelaPrincipal"))
      .catch(() => setErro("Email ou senha errada"));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f7fa" }}>
      <View style={styles.container}>
        <Text style={styles.titulo}>Bem-vindo</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
        {erro ? <Text style={styles.errorText}>{erro}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={login}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
          <Text style={styles.linkText}>Criar conta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function TelaPrincipal() {
  const [cotacoes, setCotacoes] = useState([]);
  const [atualizadoEm, setAtualizadoEm] = useState("");
  const [carregando, setCarregando] = useState(false);

  const getBandeiraUrl = (codigo) => {
    const mapaMoedaPais = {
      USD: "us",
      EUR: "eu",
      GBP: "gb",
      JPY: "jp",
      CHF: "ch",
      CAD: "ca",
      AUD: "au",
      NZD: "nz",
      CNY: "cn",
      KRW: "kr",
      INR: "in",
      RUB: "ru",
      ARS: "ar",
      MXN: "mx",
      BRL: "br",
      ILS: "il",
    };

    const cryptoLogos = {
      BTC: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
      ETH: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
      LTC: "https://cryptologos.cc/logos/litecoin-ltc-logo.png",
      XRP: "https://cryptologos.cc/logos/xrp-xrp-logo.png",
      ADA: "https://cryptologos.cc/logos/cardano-ada-logo.png",
      SOL: "https://cryptologos.cc/logos/solana-sol-logo.png",
      DOT: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png",
      DOGE: "https://cryptologos.cc/logos/dogecoin-doge-logo.png",
      SHIB: "https://cryptologos.cc/logos/shiba-inu-shib-logo.png",
    };

    if (cryptoLogos[codigo]) {
      return cryptoLogos[codigo];
    }

    const pais = mapaMoedaPais[codigo];

    return pais
      ? `https://flagcdn.com/w40/${pais}.png`
      : "https://flagcdn.com/w40/un.png";
  };
  const buscarCotacoes = async () => {
    setCarregando(true);
    try {
      const resposta = await fetch(
        "https://economia.awesomeapi.com.br/json/all",
      );
      const dados = await resposta.json();
      const agora = new Date();
      setAtualizadoEm(
        `${agora.toLocaleDateString("pt-BR")} ${agora.toLocaleTimeString("pt-BR")}`,
      );
      const listaMoedas = Object.keys(dados)
        .map((key) => ({
          codigo: key,
          nome: dados[key].name,
          valor: parseFloat(dados[key].bid).toFixed(2),
          bandeiraUrl: getBandeiraUrl(key),
        }))
        .filter((m) => m.valor > 0);
      setCotacoes(listaMoedas);
    } catch {
      Alert.alert("Erro", "Falha ao buscar");
    } finally {
      setCarregando(false);
    }
  };

  React.useEffect(() => {
    buscarCotacoes();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#eef2f5" }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cotação de Moedas</Text>
      </View>
      <View style={{ flex: 1, padding: 20 }}>
        <View style={styles.subHeader}>
          <Text style={styles.subHeaderTitle}>Cotação Atual</Text>
          <Text style={styles.subHeaderText}>
            Ultima atualizacao: {atualizadoEm || "Carregando..."}
          </Text>
        </View>
        {carregando ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          <ScrollView>
            {cotacoes.map((m, i) => (
              <View key={i} style={styles.card}>
                <View style={styles.moedaInfo}>
                  <Image
                    source={{ uri: m.bandeiraUrl }}
                    style={[
                      styles.bandeira,
                      m.codigo === "DOGE" ||
                      m.codigo === "BTC" ||
                      m.codigo === "ETH"
                        ? styles.bandeiraCrypto
                        : null,
                    ]}
                    onError={(e) => {
                      e.currentTarget.setNativeProps({
                        src: "https://flagcdn.com/w40/un.png",
                      });
                    }}
                  />
                  <View>
                    <Text style={styles.moeda}>{m.nome}</Text>
                    <Text style={styles.moedaCodigo}>Codigo: {m.codigo}</Text>
                  </View>
                </View>
                <Text style={styles.valor}>R$ {m.valor}</Text>
              </View>
            ))}
          </ScrollView>
        )}
        <TouchableOpacity
          style={styles.botao}
          onPress={buscarCotacoes}
          disabled={carregando}
        >
          <Text style={styles.botaoTexto}>
            {carregando ? "Atualizando..." : "Atualizar Cotações"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e0e0e0",
  },
  appWrapper: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 25,
    justifyContent: "center",
    backgroundColor: "#f5f7fa",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1.5,
    padding: 12,
    marginBottom: 20,
    borderRadius: 12,
    borderColor: "#dcdde1",
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#033e66",
    padding: 15,
    marginTop: 10,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkText: {
    color: "#469ed8",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 20,
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 13,
    marginBottom: 10,
    textAlign: "center",
  },
  header: {
    backgroundColor: "#2f3c7e",
    padding: 20,
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  subHeader: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  subHeaderTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subHeaderText: {
    fontSize: 12,
    color: "#666",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  moedaInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bandeira: {
    width: 32,
    height: 24,
    resizeMode: "contain",
  },
  moeda: {
    fontSize: 16,
    fontWeight: "bold",
  },
  moedaCodigo: {
    fontSize: 12,
    color: "#666",
  },
  valor: {
    fontSize: 20,
    color: "#2f3c7e",
    fontWeight: "bold",
  },
  botao: {
    backgroundColor: "#4e9e81",
    padding: 15,
    borderRadius: 30,
    marginTop: 20,
    alignItems: "center",
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  bottomBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    justifyContent: "space-around",
    alignItems: "center",
  },
  bottomBarItem: {
    alignItems: "center",
    gap: 4,
  },
  bottomBarIcon: {
    fontSize: 24,
  },
  bottomBarText: {
    fontSize: 12,
    color: "#666",
  },
});
