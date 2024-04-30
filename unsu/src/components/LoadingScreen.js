import Jumbotron from "../Jumbotron";
import "./LoadingScreen.css";
import ClimingBoxLoader from "react-spinners/FadeLoader";

const LoadingScreen = ()=>{

    return (
        <>
            <Jumbotron title="Lorem ipsum"/>

            <div className="row mt-4">
                <div className="col">
                    <div className="loading-wrapper">
                        <ClimingBoxLoader/>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoadingScreen;