import Jumbotron from "../../../Jumbotron";
import axios from "../../utils/CustomAxios";
import { useCallback, useEffect, useState } from "react";


const Charge = ()=>{
    //state
    const [charges, setCharges] = useState([]);

    //불러와
    useEffect(()=>{
        loadData();
    },[]);
    //콜백해
    const loadData = useCallback(async()=>{
        const resp = await axios.get("/charge/");
        setCharges(resp.data);
    },[charges]);

    return (
        <>
            <Jumbotron title="요금 관리"/>

            <div className="row mt-4">
                <div className="col text-end">
                    <button className="btn btn-info">
                         &nbsp;
                        요금 등록
                    </button>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Charge;