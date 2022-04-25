
import React, { useEffect, useState } from "react";
import { Switch, useRouteMatch, Route } from "react-router-dom";
import axios from 'axios'




// Services
import { Request } from "../../services/Requests";

// components
import Pagination from "../Pager";
import Loader from "../loader";
import Header from "../Header";
import Table from "../Table";
import recordData from './data'
import CreateForm from "../CreateForm";



export default function RecordWrapper(props) {
  const request = new Request(props.path);

  let { path } = useRouteMatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [changed, setChanged] = useState(false);

  const [model, setModel] = useState(props.model);
  
 


  useEffect(() => {
    request.get().then((res) => {
      if (typeof res === "string") {
        setIsLoaded(true);

        setData(recordData.recording);
      } else {
        setError(res);
    
      }
    });
  }, [changed]);



//   useEffect(() => {

// async function fetchData(){
// const request = await axios.get(`${apiUrl}/extension-agent`)
// setChanged(request.data.results);
// return results
// }
// fetchData()

//   }, [changed]);



  const editGroup = (group) => {
    setModel(group);
    $("#profileDetails").modal("show");
  };

  const del = (data) => {
    request
      .delete(data)
      .then((res) => (changed ? setChanged(false) : setChanged(true)));
  };

  const create = (event) => {
    event.preventDefault();

    request.add(model).then((res) => {
      // re rener
      !changed ? setChanged(true) : setChanged(false);

      // close modal
      $("#createForm").modal("hide");

      // reset state
      // setModel(props.model)
    });
  };

  return (
    <div className="container-fluid p-0">
      <div>
        <Header
          heading={props.heading}
          smsBtn={props.smsBtn}
          btns={props.headerModel}
          onNext={() => setCurrentPage(currentPage + 1)}
        />

        <main role="main">
          {error ? (
            <div>error: {error}</div>
          ) : !isLoaded ? (
            <Loader />
          ) : (
            <Table
              tableHeaders={props.tableModel}
              data={data}
              currentPage={currentPage}
              delete={(data) => del(data)}
            />
          )}
          {isLoaded && (
            <Pagination
              currentPage={currentPage}
              onChange={(num) => setCurrentPage(num)}
              totalCount={data.length}
            />
          )}

          <Switch>
            {/* <Route
              path="/groups/details/:id"
              children={
                <GroupProfilingDetails
                  details={order}
                  goBack={() => history.goBack()}
                  re={
                    () => !changed
                      ? setChanged(true)
                      : setChanged(false)
                  } />
              }
            /> */}
            <Route
              path={`${path}/create`}
              children={
                <CreateForm
                  submit={(e) => create(e)}
                  title={props.formTitle}
                  goBack={() => props.history.goBack()}
                  re={() => (!changed ? setChanged(true) : setChanged(false))}
                >
                  <props.create />
                </CreateForm>
              }
            />
          </Switch>
        </main>
      </div>
    </div>
  );
}
