import React, { Component } from "react";
import User from "../interfaces/User.interface";

interface SearchState {
  hasError: boolean;
  pokemon: Pokemon;
}

interface Pokemon {
  name: string;
  numberOfAbilities: number;
  baseExperience: number;
  imageURL: string;
}

export class PokemonSearch extends Component<User, SearchState> {
  pokemonRef: React.RefObject<HTMLInputElement>;

  constructor(props: User) {
    super(props);
    this.pokemonRef = React.createRef();
    this.state = {
      pokemon: null,
      hasError: false,
    };
  }

  handleResponse = (response: Response) => {
    return response.json().then(data => {
      console.log(data);
      return this.setState({
        hasError: false,
        pokemon: {
          name: data.name,
          numberOfAbilities: data.abilities.length,
          baseExperience: data.base_experience,
          imageURL: data.sprites.front_default,
        },
      });
    });
  };

  onSearchClick = (): void => {
    const inputValue = this.pokemonRef.current.value;

    fetch(`https://pokeapi.co/api/v2/pokemon/${inputValue}`).then(response => {
      if (response.status !== 200) {
        return this.setState({ hasError: true });
      } else {
        this.handleResponse(response);
      }
    });
  };

  render() {
    const { name, numberOfPokemon } = this.props;
    const { hasError, pokemon } = this.state;

    let resultMarkup;

    if (hasError) {
      resultMarkup = <p>No pokemon found. Please try again</p>;
    } else if (pokemon) {
      resultMarkup = (
        <section>
          <img
            src={pokemon.imageURL}
            alt={pokemon.name}
            className="pokemon-image"
          />
          <p>
            {pokemon.name} has {pokemon.numberOfAbilities} abilities and{" "}
            {pokemon.baseExperience} base experience points
          </p>
        </section>
      );
    }

    return (
      <div>
        <p>
          User {name}{" "}
          {numberOfPokemon && <span>has {numberOfPokemon} pokemons</span>}
        </p>

        <input type="text" ref={this.pokemonRef} />
        <button onClick={this.onSearchClick} className="search-button">
          Search
        </button>

        {resultMarkup}
      </div>
    );
  }
}

export default PokemonSearch;
