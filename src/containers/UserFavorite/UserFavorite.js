/**
 * Created by hanwencheng on 2/10/16.
 */

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {isLoaded, onLoad, onAppendList, onDisableAppend,displayArrow, hideArrow} from 'redux/modules/favorite';
import {bindActionCreators} from 'redux';
import connectData from 'helpers/connectData';
import {List} from "components";
import Helmet from 'react-helmet';
var config = require('../../config');
import uiStyles from '../../theme/uiStyles';
import { Link } from 'react-router';
import {FlatButton, FontIcon, Snackbar} from 'material-ui';
import strings from '../../constant/strings'
import {DropDownMenu, MenuItem,RaisedButton} from 'material-ui';


function fetchDataDeferred(getState, dispatch) {
  if (!isLoaded(getState())) {
    var user = getState().auth.user
    //console.log("after load we get state:", getState().router)
    return dispatch(onLoad(user._id, user.starList ? user.starList : []))
  }
}

@connectData(null, fetchDataDeferred)

@connect(
  state => ({
    user : state.auth.user,
    entities: state.favorite.list,
    error: state.favorite.error,
    loading: state.favorite.loading,
    loaded: state.favorite.loaded,
    isEnd : state.favorite.isEnd,
    arrowDisplayed : state.favorite.arrowDisplay,
    deleteFeedback : state.favorite.deleteFeedback,
  }),
  {onLoad, onAppendList, onDisableAppend,displayArrow, hideArrow}
)
export default class Entities extends Component {
  static propTypes = {
    entities : PropTypes.array,
    error: PropTypes.string,
    loading: PropTypes.bool,
    loaded :PropTypes.bool,
    user : PropTypes.object,
    isEnd : PropTypes.bool,
    deleteFeedback : PropTypes.string,

    onDisableAppend : PropTypes.func.isRequired,
    onAppendList : PropTypes.func.isRequired,
    onLoad: PropTypes.func.isRequired,
    displayArrow :PropTypes.func.isRequired,
    hideArrow : PropTypes.func.isRequired,
  };

  loadList = (event) => {
    var starList = this.props.user.starList
    event.preventDefault();
    this.props.onLoad(this.props.user._id , starList ? starList : []);
  }

  handleScroll = (event) => {
    var starList = this.props.user.starList ? this.props.user.starList : []
    var listBody = event.srcElement.body;

    if(window.innerHeight + listBody.scrollTop >= config.arrowDisplayHeight){
      if(!this.props.arrowDisplayed) this.props.displayArrow()
    }else{
      if(this.props.arrowDisplayed) this.props.hideArrow()
    }

    if(window.innerHeight + listBody.scrollTop >= listBody.scrollHeight - 20){
      //temporary disable append util we get result
      if(!this.props.loading && !this.props.isEnd){
        this.props.onDisableAppend();
        //console.log('now appending to list')
        this.props.onAppendList(this.props.user._id, starList, this.props.entities.length);
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
    const styles = require('./UserFavorite.scss');
    const {loaded, error, loading, deleteFeedback} = this.props;
    const houses = this.props.entities;

    let refreshClassName = 'fa fa-refresh';
    if (loading) {
      refreshClassName += ' fa-spin';
    }

    return (
      <div>
        <Helmet title="我的收藏"/>
        {loaded && houses.length > 0 &&
        <div className={styles.listNav}>
          <RaisedButton onClick={this.loadList} style={{lineHeight: "36px" }}>
            <i className={refreshClassName}/>刷新
          </RaisedButton>
        </div>
        }

        {loaded &&
        <div className={styles.gridContainer}>
          { houses.length ?
            <List houses={this.props.entities} onDeleteHouse={this.props.onDeleteHouse}/>
            :
            <div className={styles.noHouseYet}>
              <div className={styles.textHint}>
                <p>{strings.noUserFavorite}</p>
              </div>
            </div>
          }
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
        {this.props.arrowDisplayed &&
        <div className={styles.upArrowContainer} onClick={this.onUpArrowClick}>
          <i className={"fa fa-arrow-up fa-2x " + styles.upArrow}/>
        </div>}


        <Snackbar
          open={deleteFeedback != null}
          message={ deleteFeedback != null ? deleteFeedback : ""}
          autoHideDuration={4000}
          bodyStyle={uiStyles.snackBarStyleBlue}
          onRequestClose={(reason) => {
            this.props.onClearDeleteFeedback()
          }}
        />
      </div>
    );
  }
}