import React, { useState, useEffect } from 'react';
import JobTable from './jobTable.jsx';

const Tab = () => {
  const [configTabState, setConfigTabState] = useState("nav nav-link");
  const [configContentState, setConfigContentState] = useState("tab-pane fade");
  const [buildTabState, setBuildTabState] = useState("nav nav-link active");
  const [buildContentState, setBuildContentState] = useState("tab-pane active");

  const setConfigTab = () => {
    setConfigTabState("nav nav-link active");
    setConfigContentState("tab-pane active");
    setBuildTabState("nav nav-link");
    setBuildContentState("tab-pane fade");
  };

  const setBuildTab = () => {
    setConfigTabState("nav nav-link");
    setConfigContentState("tab-pane fade");
    setBuildTabState("nav nav-link active");
    setBuildContentState("tab-pane active");
  };

  return(
    <div>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <a className={ configTabState }
            onClick={ setConfigTab }>
            Lab Config
          </a>
        </li>
        <li className="nav-item">
          <a className={ buildTabState }
            onClick={ setBuildTab }>
            Builds
          </a>
        </li>
        <li className="nav nav-item">
          <a className="nav nav-link">R&A</a>
        </li>
      </ul>
      <div className="tab-content">
        <div id="config" className={ configContentState }>
        </div>
        <div id="builds" className={ buildContentState }>
          <br></br>
          <JobTable />
        </div>
        <div id="RnA" className="tab-pane fade">
          Under Construction
        </div>
      </div>
    </div>
  );

}

export default Tab;
