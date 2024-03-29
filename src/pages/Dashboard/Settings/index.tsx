import React, { useState, useEffect } from "react";
import { Button, Collapse } from "reactstrap";
import classnames from "classnames";

// hooks
import { useProfile, useRedux } from "../../../hooks/index";

// actions
import { getSettings, updateSettings } from "../../../redux/actions";

// constants
import { SETTINGS_COLLAPSES } from "../../../constants";

// interface
import { SettingsTypes } from "../../../data/settings";
import { userModel } from "../../../redux/auth/types";

// components
import Loader from "../../../components/Loader";
import AppSimpleBar from "../../../components/AppSimpleBar";
import UserCoverImage from "./UserCoverImage";
import UserProfile from "./UserProfile";
import PersonalInfo from "./PersonalInfo";
import ThemeSettings from "./ThemeSettings";
import Privacy from "./Privacy";
import Security from "./Security";
import Help from "./Help";

interface CollapseItemTypes {
  value:
    | SETTINGS_COLLAPSES.PROFILE
    | SETTINGS_COLLAPSES.HELP
    | SETTINGS_COLLAPSES.PRIVACY
    | SETTINGS_COLLAPSES.SECURITY
    | SETTINGS_COLLAPSES.THEME;
  label: string;
  icon: string;
  component: any;
}

interface AccordianItemProps {
  item: CollapseItemTypes;
  onChange: (
    id:
      | null
      | SETTINGS_COLLAPSES.PROFILE
      | SETTINGS_COLLAPSES.HELP
      | SETTINGS_COLLAPSES.PRIVACY
      | SETTINGS_COLLAPSES.SECURITY
      | SETTINGS_COLLAPSES.THEME
  ) => void;
  selectedMenu:
    | null
    | SETTINGS_COLLAPSES.PROFILE
    | SETTINGS_COLLAPSES.HELP
    | SETTINGS_COLLAPSES.PRIVACY
    | SETTINGS_COLLAPSES.SECURITY
    | SETTINGS_COLLAPSES.THEME;
}
const AccordianItem = ({
  item,
  selectedMenu,
  onChange,
}: AccordianItemProps) => {
  const isOpen: boolean =
    selectedMenu && selectedMenu === item.value ? true : false;
  const toggleCollapse = () => {
    if (isOpen) {
      onChange(null);
    } else {
      onChange(item.value);
    }
  };
  return (
    <div className="accordion-item">
      <div className="accordion-header" id="headerpersonalinfo">
        <Button
          color="none"
          className={classnames(
            "accordion-button",
            "font-size-14",
            "fw-medium",
            { collapsed: !isOpen }
          )}
          onClick={toggleCollapse}
          type="button"
        >
          <i className={classnames("text-muted", "me-3", item.icon)}></i>{" "}
          {item.label}
        </Button>
      </div>
      <Collapse
        isOpen={isOpen}
        id="personalinfo"
        className="accordion-collapse"
        aria-labelledby="headerpersonalinfo"
        data-bs-parent="#settingprofile"
      >
        {item.component}
      </Collapse>
    </div>
  );
};
interface IndexProps {}
const Index = (props: IndexProps) => {
  // global store
  const { dispatch, useAppSelector } = useRedux();

  //get user information
  const { settingsData, getSettingsLoading } = useAppSelector(state => ({
    settingsData: state.Settings.settings,
    getSettingsLoading: state.Profile.getSettingsLoading,
    isSettingsFetched: state.Profile.isSettingsFetched,
  }));
  const { userProfile } = useProfile();

  // get user settings
  // useEffect(() => {
  //   dispatch(getSettings());
  // }, [dispatch]);

  const [settings, setSettings] = useState<SettingsTypes>(settingsData);
  useEffect(() => {
    setSettings(settingsData);
  }, [settingsData]);

  /*
  api calling
  */
  const onChangeData = (field: string, value: any) => {
    dispatch(updateSettings(field, value));
  };

  /*
  collapse handeling
  */
  const [selectedMenu, setSelectedMenu] = useState<
    | null
    | SETTINGS_COLLAPSES.PROFILE
    | SETTINGS_COLLAPSES.HELP
    | SETTINGS_COLLAPSES.PRIVACY
    | SETTINGS_COLLAPSES.SECURITY
    | SETTINGS_COLLAPSES.THEME
  >(null);

  const collapseItems: CollapseItemTypes[] = [
    {
      value: SETTINGS_COLLAPSES.PROFILE,
      label: "個人資料",
      icon: "bx bxs-user",
      component: <PersonalInfo user={userProfile} />,
    },
    {
      value: SETTINGS_COLLAPSES.THEME,
      label: "主題",
      icon: "bx bxs-adjust-alt",
      component: (
        <ThemeSettings theme={settings.theme} onChangeData={onChangeData} />
      ),
    },
    /*{
      value: SETTINGS_COLLAPSES.PRIVACY,
      label: "Privacy",
      icon: "bx bxs-lock",
      component: (
        <Privacy privacy={settings.privacy} onChangeSettings={onChangeData} />
      ),
    },
    {
      value: SETTINGS_COLLAPSES.SECURITY,
      label: "Security",
      icon: "bx bxs-check-shield",
      component: (
        <Security
          security={settings.security}
          onChangeSettings={onChangeData}
        />
      ),
    },
    {
      value: SETTINGS_COLLAPSES.HELP,
      label: "Help",
      icon: "bx bxs-help-circle",
      component: <Help />,
    },*/
  ];

  const onChangeCollapse = (
    id:
      | null
      | SETTINGS_COLLAPSES.PROFILE
      | SETTINGS_COLLAPSES.HELP
      | SETTINGS_COLLAPSES.PRIVACY
      | SETTINGS_COLLAPSES.SECURITY
      | SETTINGS_COLLAPSES.THEME
  ) => {
    setSelectedMenu(id);
  };

  return (
    <div className="position-relative">
      {getSettingsLoading && <Loader />}
      <UserCoverImage user={userProfile} />

      <UserProfile user={userProfile} status={settings.status} />
      {/* Start User profile description */}
      <AppSimpleBar className="user-setting">
        <div id="settingprofile" className="accordion accordion-flush">
          {(collapseItems || []).map((item: CollapseItemTypes, key: number) => (
            <AccordianItem
              item={item}
              key={key}
              selectedMenu={selectedMenu}
              onChange={onChangeCollapse}
            />
          ))}
        </div>
        {/* end profile-setting-accordion */}
      </AppSimpleBar>
    </div>
  );
};

export default Index;
