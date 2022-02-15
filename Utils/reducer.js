  const initialState = {
    winningStreak: 0,
    timerCount: 10,
    scene: "Home",
    movies: [],
    selectedMovie: {},
  }
  
  export const reducer = (state = initialState, action) => {
    switch (action.type) {
      case "INCREASE_WINNING_STREAK":
        return {
          ...state,
          winningStreak: state.winningStreak + 1,
        };
      case "RESET_WINNING_STREAK":
        return {
          ...state,
          winningStreak: 0,
        };
      case "COUNTDOWN_TIMER":
        return {
          ...state,
          timerCount: state.timerCount - 1,
        };
      case "SET_SCENE":
        return {
          ...state,
          scene: action.name
        };
      case "SET_MOVIES":
        return {
          ...state,
          movies: action.movies
        };
      case "SET_SELECTED_MOVIE":
        return {
          ...state,
          selectedMovie: action.selectedMovie
        };
    }
    return state;
  };