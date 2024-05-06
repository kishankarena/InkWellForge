import styles from "./Home.module.css";

const Home = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles["container__heading--size"]}>Welcome to Simform</h1>
    </div>
  );
};

export default Home;
