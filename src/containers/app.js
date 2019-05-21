import React, { Component } from 'react';
import styles from './app.css';


type Props = {
  dispatch: () => void,
  loaded: boolean
}

export class AppContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      suggestionsList: [
        {name: 'Amazon'}, 
        {name: 'deepak'}, 
        {name: 'collebra'},
        {name: 'Kallayya'},
        {name: 'Hiremath'},
        {name: 'React'},
        ],
      suggestions: [],
      chipSelectedToRemove: false,
      chips: [],

    };
  }
      
  getInitialState() {
    return {
      chips: [],
      KEY:   {
        backspace: 8,
        tab:       9,
        enter:     13
      },
      // only allow letters, numbers and spaces inbetween words
      INVALID_CHARS: /[^a-zA-Z0-9 ]/g
    };
  }

        componentDidMount() {
          this.setChips(this.props.chips);
        }
        
        componentWillReceiveProps(nextProps) {
          this.setChips(nextProps.chips);
        }
        
        setChips(chips) {
          if (chips && chips.length) this.setState({ chips });
        }
      

  matchInputToList = (input) => {
    let { suggestionsList } = this.state;
    const reg = new RegExp(input.split('').join('\\w*').replace(/\W/, ""), 'i');
    return suggestionsList.filter(function(person) {
      if (person.name.match(reg)) {
        return person;
      }
    });
  }

  onkeyDown = (event) => {
    let keyPressed = event.which;

    if (keyPressed === this.state.KEY.enter ||
        (keyPressed === this.state.KEY.tab && event.target.value)) {
      event.preventDefault();
      this.updateChips(event);
    } else if (keyPressed === this.state.KEY.backspace) {
      let chips = this.state.chips;

      if (!event.target.value && chips.length) {
        this.removeChip(chips[chips.length - 1]);
      }
    }
  }


  clearInvalidChars = (event) => {
    let value = event.target.value;

    if (this.state.INVALID_CHARS.test(value)) {
      event.target.value = value.replace(this.state.INVALID_CHARS, '');
    } else if (value.length > this.props.maxlength) {
      event.target.value = value.substr(0, this.props.maxlength);
    }
  }


  handleInputChange = (event) => {
    if(event.target.value) {
      const suggestions = this.matchInputToList(event.target.value);
      this.setState({ suggestions: suggestions});
    }
  }

  addSuggestionToChips = (value) => {
    let { suggestionsList, suggestions, chips } = this.state;

    let filteredSuggestionsList = Object.assign({}, filteredSuggestionsList);
    filteredSuggestionsList = suggestionsList.filter((item) => item.name !== value.name);

    this.setState({ 
      chips: chips.concat(value),
      suggestions: [],
      suggestionsList: filteredSuggestionsList

    });
  }

  removeChip = (chip) => {
    let { suggestionsList, suggestions, chips } = this.state;

    let filteredChips = Object.assign({}, chips);
    filteredChips = chips.filter((item) => item.name !== chip.name);

    this.setState({ 
      chips: filteredChips, 
      suggestions: [],
      suggestionsList: suggestionsList.concat(chip),

    });
  }

  handleInputClick = (event) => {
    let { suggestionsList, suggestions } = this.state;
    this.setState({ suggestions:  suggestionsList})
  } 

  render() {
    const { chips, suggestions, suggestionsList, inputValue } = this.state;
    return (
        <div className={styles.parentContainer}>
          {
            chips.length > 0 && (
              <ul className={styles.chipsList} id="chipsList">
                {
                  chips.map((chip, key) => {
                    return(
                      <li key={key} className={styles.chipBox}>
                          <span>{chip.name}</span>
                          <span className={styles.deleteIcon} onClick={() => this.removeChip(chip)}>X</span>
                      </li>)
                  })
                }
              </ul>
            )
          }

          <div className={styles.autoComplete}>
            <input 
              type="text"
              placeholder="Search Name"
              className={styles.autoCompleteInput}
              defaultValue={inputValue}
              onChange={this.handleInputChange}
              onClick={this.handleInputClick}
              onKeyDown={this.onkeyDown}
              onKeyUp={this.clearInvalidChars}
            />
              {
                suggestions.length > 0 && (
                  <ul className={styles.suggestionsList}>
                    {
                      suggestions.map((suggestion, key) => {
                        return(<li key={key} className={styles.suggestion} onClick={() => {this.addSuggestionToChips(suggestion)}}>{suggestion.name}</li>)
                      })
                    }
                  </ul>
                )
              }
          </div>
        </div>
    );
  }
}


export default AppContainer;
