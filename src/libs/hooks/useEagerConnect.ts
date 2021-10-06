import { t } from "@lingui/macro";
import { message } from "antd";
import { useEffect, useState } from "react";
import injected from "../connectors/injected";
import useWeb3 from "./useWeb3";

const useEagerConnect = () => {
  const { activate, active, deactivate } = useWeb3();

  const [tried, setTried] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const isAuthorized = await injected.connector.isAuthorized();
        if (isAuthorized) {
          activate(injected.connector, undefined, true).catch(() => {
            deactivate();
            message.error(
              t`This network is not supported, please switch the network`
            );
          });
        }
      } finally {
        setTried(true);
      }
    })();

  }, [activate, deactivate]);

  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
};

export default useEagerConnect;
