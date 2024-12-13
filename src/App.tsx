import React, { useState, useEffect } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

type Props = {
  debounce?: number;
  onSelected?: (person: Person) => void;
};

export const App: React.FC<Props> = ({ debounce = 300, onSelected }) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState<string>('');
  const [filteredPeople, setFilteredPeople] =
    useState<Person[]>(peopleFromServer);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleSelected = (person: Person) => {
    setSelectedPerson(person);

    if (onSelected) {
      onSelected(person);
    }
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const showPeople =
    isFocused && query === '' ? peopleFromServer : filteredPeople;

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) =>
    setQuery(event.target.value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilteredPeople(
        peopleFromServer.filter(person =>
          person.name.toLowerCase().includes(query.toLowerCase()),
        ),
      );
    }, debounce);

    return () => clearTimeout(timer);
  }, [query, debounce]);

  useEffect(() => {
    if (query !== '' && selectedPerson) {
      setSelectedPerson(null);
    }
  }, [query, selectedPerson]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : `No selected person`}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQuery}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {showPeople.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onClick={() => handleSelected(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {filteredPeople.length === 0 && (
          <div
            className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </main>
    </div>
  );
};
