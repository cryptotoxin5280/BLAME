// jobTable.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import socketIOClient from 'socket.io-client';

const JobTable = () => {
  const socket = socketIOClient('http://localhost:3002');
  const [data, setData] = useState([]);
  const tableRef = React.createRef();

  const getDateString = (date) => {
    let dateParts = date.split(".")[0].split("T");
    let mergeDate = dateParts[0];
    let mergeTime = dateParts[1];
    return( `${ mergeDate } ${ mergeTime }` );
  }

  const setStatusIcon = (jobStatus) => {
    switch (jobStatus) {
      case "scheduled":
        return "far fa-clock fa-2x";
        break;
      case "unit-testing":
        return "fas fa-flask fa-2x";
        break;
      case "building":
        return "far fa-cog fa-2x fa-spin";
        break;
      case "e2e-testing":
        return "";
        break;
      case "pass":
        return "";
        break;
      case "fail":
        return "fas fa-angry fa-2x";
        break;
      case "cancelled":
        return "fas fa-skull-crossbones fa-2x";
        break;
      case "unknown":
      default:
        return "fas fa-question-circle fa-2x";
    }
  };

  useEffect( () => {
    axios
      .get("http://localhost:3001/api/job")
      .then( response => {
        setData(response.data);
      })
      .catch( err => {
        console.log(err);
      });
  }, []);

  useEffect( () => {

    socket.on("insert-job", data => {

      let json = JSON.parse(data);

      let newRow = tableRef.current.insertRow(0);

      let dateCell = newRow.insertCell(-1);
      dateCell.appendChild(
        document.createTextNode( getDateString( json["date"]) ));

      let pullRequestNoCell = newRow.insertCell(-1);
      pullRequestNoCell.appendChild(
        document.createTextNode( json["pullRequestNo"] ));

      let developerCell = newRow.insertCell(-1);
      developerCell.appendChild(
        document.createTextNode( json["authorName"] ));

      let sourceBranchCell = newRow.insertCell(-1);
      sourceBranchCell.appendChild(
        document.createTextNode( json["sourceBranch"] ));

      let statusCell = newRow.insertCell(-1);
      let statusIcon = document.createElement("i");
      statusIcon.setAttribute( "class", 
        setStatusIcon( json["status"] ) );
      statusCell.appendChild( statusIcon );

     let actionCell = newRow.insertCell(-1);
     let cancelButton = document.createElement("button");
     cancelButton.setAttribute( "class", "btn btn-danger" );
     cancelButton.innerText = "Cancel";
     actionCell.appendChild(cancelButton);

    });

    socket.on("update-job-status", data => {
      //alert( data );
      //document.getElementById("")
    });

  }, []);

  return (
    <div>
      <table id="tjob" className="table table-hover">
        <thead>
          <tr>
            <th scope="col">Merge Date</th>
            <th scope="col">PR No.</th>
            <th scope="col">Developer</th>
            <th scope="col">Source Branch</th>
            <th scope="col">Status</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody ref={ tableRef }>
          { data.map(job => (
            <tr key={ job.pullRequestNo }>
              <td>{ getDateString( job.date )}</td>
              <td align="center">{ job.pullRequestNo }</td>
              <td>{ job.authorName }</td>
              <td>{ job.sourceBranch }</td>
              <td align="center">
                <i className={ setStatusIcon(job.status) }></i>
              </td>
              <td>
                <button type="button" className="btn btn-danger">Cancel</button>
              </td>
            </tr>
          )) }
        </tbody>
      </table>
    </div>
  );
}

export default JobTable;
