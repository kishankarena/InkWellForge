import MuiExample from "src/components/muiExample/MuiExample";
import I18Example from "src/components/i18Example/I18Example";
import { useState, ReactNode } from "react";
import styles from "./Home.module.css";

type ExampleComponent = {
  component: ReactNode;
  name: string;
}[];
const Components: ExampleComponent = [
  { name: "Material UI", component: <MuiExample /> },
  { name: "I18n", component: <I18Example /> },
];

const Home = () => {
  const [example, setExample] = useState<ExampleComponent[number]>({
    component: <></>,
    name: "Please Select",
  });

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles["container__heading--size"]}>Welcome to Simform&apos;s Boilerplate</h1>
        <img src="https://ik.imagekit.io/ashishkk22/react.svg" alt="react logo" width={200} />
      </div>
      {Components.length > 0 && (
        <div className={styles.exContainer}>
          <h2 className={styles.exContainer__heading}>Examples</h2>
          <div className={styles.exContainer__main}>
            <div>
              {Components.map((obj) => {
                return (
                  <div key={obj.name} style={{ cursor: "pointer" }}>
                    <div
                      onClick={() => setExample(obj)}
                      className={obj.name === example.name ? styles["exContainer__sidebar--underline"] : ""}
                    >
                      {obj.name}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={styles.exContainer__demo}>
              <div className={styles["exContainer__demo--heading"]}>{example?.name + " Example"} </div>
              <div>{example?.component}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
