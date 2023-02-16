import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'
import './index.css'

const apiStateValues = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  loading: 'LOADING',
  failed: 'FAILED',
}

class CowinDashboard extends Component {
  state = {cowinData: {}, apiStatus: apiStateValues.initial}

  componentDidMount() {
    this.getDataFromServer()
  }

  getDataFromServer = async () => {
    this.setState({apiStatus: apiStateValues.loading})
    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const modifiedData = {
        last7DaysVaccination: data.last_7_days_vaccination,
        vaccinationByAge: data.vaccination_by_age,
        vaccinationBygender: data.vaccination_by_gender,
      }
      this.setState({
        cowinData: modifiedData,
        apiStatus: apiStateValues.success,
      })
    } else {
      this.setState({apiStatus: apiStateValues.failed})
    }
  }

  displayLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#a3df9f" height={80} width={80} />
    </div>
  )

  displayFetchedData = () => {
    const {cowinData} = this.state
    const {
      last7DaysVaccination,
      vaccinationByAge,
      vaccinationBygender,
    } = cowinData
    const modifiedLast7DaysData = last7DaysVaccination.map(each => ({
      dose1: each.dose_1,
      dose2: each.dose_2,
      vaccineDate: each.vaccine_date,
    }))
    return (
      <>
        <div className="coverage-container">
          <VaccinationCoverage
            modifiedLast7DaysData={modifiedLast7DaysData}
            key={modifiedLast7DaysData.vaccineDate}
          >
            <h1>Vaccination Coverage</h1>
          </VaccinationCoverage>
        </div>

        <div className="by-gender-container">
          <VaccinationByGender
            vaccinationBygender={vaccinationBygender}
            key={vaccinationBygender.gender}
          >
            <h1>Vaccination by gender</h1>
          </VaccinationByGender>
        </div>

        <div className="by-age-container">
          <VaccinationByAge
            vaccinationByAge={vaccinationByAge}
            key={vaccinationByAge.age}
          >
            <h1>Vaccination by Age</h1>
          </VaccinationByAge>
        </div>
      </>
    )
  }

  displayFailedMessage = () => (
    <>
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1 className="error-message">Something went wrong</h1>
    </>
  )

  getApiStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStateValues.loading:
        return this.displayLoader()
      case apiStateValues.success:
        return this.displayFetchedData()
      case apiStateValues.failed:
        return this.displayFailedMessage()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <div className="logo-container">
          <img
            className="logo-image"
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
          />
          <h1 className="logo-name">Co-WIN</h1>
        </div>
        <h1 className="main-heading">CoWIN Vaccination in India</h1>
        <div className="charts-container">{this.getApiStatus()}</div>
      </>
    )
  }
}

export default CowinDashboard
