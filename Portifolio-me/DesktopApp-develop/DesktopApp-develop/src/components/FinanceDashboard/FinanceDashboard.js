import React, { useState, useEffect }  from "react";
import Header from "../Header";
import FinanceDashboardContainer from "./FinanceDashboardContainer";
import Loader from "../loader";
import { ExpenseService } from "../../services/ExpenseService";


export default function FinanceDashboard() {
  const buttons = [];

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);


  const expenseService = new ExpenseService();

  useEffect(
    (props) => {
      expenseService.getExpenses().then((res) => {
        if (typeof res === "string") {
          // setError(res); // todo restore when you have real API 
          setIsLoaded(true); // todo remove when we have real API
        } else {
          setIsLoaded(true);
          setData(res);
        }
      });
    },
    []
  );

  return (
    <div className="container-fluid p-0">
      <div>
        <main role="main">
          <Header heading="Finance" btns={buttons} />

          {error ? (
            <div>error: {error}</div>
          ) : !isLoaded ? (
            <Loader />
          ) : (
            <FinanceDashboardContainer/>
          )}

        </main>
      </div>
    </div>
  );
}
