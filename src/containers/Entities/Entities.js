/**
 * Created by hanwencheng on 1/6/16.
 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {isLoaded, onGetHouseList, onLocationChange, onAppendList, onDeleteHouse,onDisableAppend, onGetCityList, onInit} from 'redux/modules/entities';
import {bindActionCreators} from 'redux';
import connectData from 'helpers/connectData';
import {List} from "components";
import config from '../../config';
import Select from 'react-select';
import Helmet from 'react-helmet';
import uiStyles from "../../theme/uiStyles";
import {DropDownMenu, MenuItem,RaisedButton} from 'material-ui';

function fetchDataDeferred(getState, dispatch) {
  if (!isLoaded(getState())) {
    //console.log("after load we get state:", getState().router)
    return dispatch(onInit());
  }

}

@connectData(null, fetchDataDeferred)

@connect(
  state => ({
    isEnd : state.entities.isEnd,
    entities: state.entities.list,
    error: state.entities.error,
    loading: state.entities.loading,
    loaded: state.entities.loaded,
    locationId : state.entities.locationId,
    cityList : state.entities.cityList,
    loadingCity : state.entities.loadingCity,
    column : state.entities.column,
    user : state.auth.user,
  }),
  {onGetHouseList, onLocationChange, onAppendList, onDeleteHouse, onDisableAppend, onGetCityList}
  //dispatch => bindActionCreators({onGetHouseList}, dispatch)
)
export default class Entities extends Component {
  static propTypes = {
    user : PropTypes.object,
    entities : PropTypes.array,
    error: PropTypes.string,
    loading: PropTypes.bool,
    locationId : PropTypes.number,
    loaded :PropTypes.bool,
    isEnd : PropTypes.bool,
    cityList : PropTypes.array,
    loadingCity : PropTypes.bool,

    onDisableAppend : PropTypes.func.isRequired,
    onDeleteHouse : PropTypes.func.isRequired,
    onGetHouseList: PropTypes.func.isRequired,
    onLocationChange: PropTypes.func.isRequired,
    onAppendList : PropTypes.func.isRequired,
    onGetCityList : PropTypes.func.isRequired,
  };

  onSelectChange = (value) => {
    //value is number
    if(value === ""){
      value = null
    }
    if(this.props.locationId != value){
      this.props.onLocationChange(value);
      //console.log('now the value of select is',value)
      this.props.onGetHouseList(value, this.props.cityList)
    }
  }

  onLoadListButton = (event) => {
    this.props.onGetCityList();
    this.onSelectChange(null);
  }


  handleScroll = (event) => {
    var listBody = event.srcElement.body;
    if(window.innerHeight + listBody.scrollTop >= listBody.scrollHeight - 20){
      //temporary disable append util we get result
      if(!this.props.loading && !this.props.isEnd){
        this.props.onDisableAppend();
        //console.log('now appending to list')
        this.props.onAppendList(this.props.locationId, this.props.cityList, this.props.entities.length);
      }
    }
  }

  onUpArrowClick = (event) => {
    if(window){
      window.scrollTo(0 , 100);
    }
  }

  componentDidMount(){
    window.addEventListener('scroll', this.handleScroll)
  }
  componentWillUnmount(){
    window.removeEventListener('scroll', this.handleScroll)
  }

  render() {
    require('../../theme/react-select.css')
    const styles = require('./Entities.scss');
    const {loaded, error, loading, locationId} = this.props;
    const houses = this.props.entities;//TODO

    let refreshClassName = 'fa fa-refresh';
    if (this.props.loadingCity) {
      refreshClassName += ' fa-spin';
    }

    const listNavClass = this.props.user ? styles.listNav : styles.listNavBeforeLogin;

    return (
      <div className={styles.entities}>
        <Helmet title="房屋列表"/>
        <div className={listNavClass}>
          <div className={styles.select}>
            <Select
              name="selectCity"
              options={this.props.cityList}
              value={locationId === null || !this.props.cityList.length ? "" : this.props.cityList[locationId].label}
              onChange={this.onSelectChange}
              noResultsText={"数据库里暂无这里的房屋信息"}
              placeholder={"选择您所在的城市"}
            />
          </div>
          <div className={styles.refreshButton}>
            <RaisedButton onClick={this.onLoadListButton} style={uiStyles.buttonStyleRenewCityList}><i className={refreshClassName}/>
              更新城市列表
            </RaisedButton>
          </div>
        </div>

        {loaded &&
        <div className={styles.gridContainer}>
          { houses.length ?
            <List houses={this.props.entities} user={this.props.user} onDeleteHouse={this.props.onDeleteHouse}/>
             :
            <div className={styles.regionNoSource}><p>Ooops! 这个地区暂时没可用的房源!</p></div>}
        </div>
        }

        {error &&
        <div className="alert alert-danger" role="alert">
          <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true">sorry</span>
          {' '}
          {error}
        </div>}

        {loading &&
        <div className={styles.loading}>
          <p className={styles.loadingText}> Loading Now</p>
          <p><i className="fa fa-spin fa-refresh fa-4x"/></p>
        </div>}

        <div className={styles.upArrowContainer} onClick={this.onUpArrowClick}>
          <i className={"fa fa-arrow-up fa-2x " + styles.upArrow}/>
        </div>
      </div>
    );
  }
}
