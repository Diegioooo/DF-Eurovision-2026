export type QuestionType = 'song' | 'general';

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  text: string[];
  options: string[];
  correctIndex: number;
}

export interface SongQuestion extends BaseQuestion {
  type: 'song';
  songName: string;
  artist: string;
  flag: string;
  correctLyric: string[];
}

export interface GeneralQuestion extends BaseQuestion {
  type: 'general';
}

export type Question = SongQuestion | GeneralQuestion;

export const songQuestionsPool: SongQuestion[] = [
  {
    id: 's1',
    type: 'song',
    flag: '🇧🇪',
    artist: 'Essyla',
    songName: 'Dancing on the Ice',
    text: ['I keep _______', "'Cause I feel alive"],
    options: ['dancing on the ice', 'singing all the night', 'that old photo', 'chasing the sunset'],
    correctIndex: 0,
    correctLyric: ['I keep dancing on the ice', "'Cause I feel alive"],
  },
  {
    id: 's2',
    type: 'song',
    flag: '🇲🇹',
    artist: 'Aidan',
    songName: 'Bella',
    text: ['After all this time it is you', 'Ma che _______, _______, _______'],
    options: ['cosa, cosa, cosa', 'vuoi, vuoi, vuoi', 'bella, bella, bella', 'resti, resti, resti'],
    correctIndex: 2,
    correctLyric: ['After all this time it is you', 'Ma che bella, bella, bella'],
  },
  {
    id: 's3',
    type: 'song',
    flag: '🇬🇧',
    artist: 'Look Mum No Computer',
    songName: 'Eins, Zwei, Drei',
    text: ['With a slice of _______', "I'll pay, you can owe me"],
    options: ['heaven', 'pepperoni', 'moonlight', 'cheesecake'],
    correctIndex: 1,
    correctLyric: ['With a slice of pepperoni', "I'll pay, you can owe me"],
  },
  {
    id: 's4',
    type: 'song',
    flag: '🇲🇩',
    artist: 'Satoshi',
    songName: 'Viva, Moldova!',
    text: ['Viva _______, aloha, addio, vida loca', 'Soroca, Europa, Palma de Mallorca'],
    options: ['Lituania', 'Moldova', 'Albania', 'Finland'],
    correctIndex: 1,
    correctLyric: ['Viva Moldova, aloha, addio, vida loca', 'Soroca, Europa, Palma de Mallorca'],
  },
  {
    id: 's5',
    type: 'song',
    flag: '🇨🇾',
    artist: 'Antigoni',
    songName: 'Jalla',
    text: ['_______, _______, they want _______', '_______, _______, they want _______'],
    options: ['party', 'pizza', 'money', 'jalla'],
    correctIndex: 3,
    correctLyric: ['jalla, jalla, they want jalla', 'jalla, jalla, they want jalla'],
  },
  {
    id: 's6',
    type: 'song',
    flag: '🇮🇹',
    artist: 'Sal Da Vinci',
    songName: 'Per Sempre Sì',
    text: ['Saremo io e te', '_______, sarà pe\' sempe\' "sì"'],
    options: ['Accussì', 'Da qui', 'Cosi', 'Per noi'],
    correctIndex: 0,
    correctLyric: ['Saremo io e te', 'Accussì, sarà pe\' sempe\' "sì"'],
  }
];

export const generalQuestionsPool: GeneralQuestion[] = [
  {
    id: 'g1',
    type: 'general',
    text: ['Quale paese detiene il record di vittorie all’Eurovision (a pari merito)?'],
    options: ['Svezia e Irlanda', 'Italia e Regno Unito', 'Francia e Germania', 'Norvegia e Ucraina'],
    correctIndex: 0,
  },
  {
    id: 'g2',
    type: 'general',
    text: ['Perché l’Australia partecipa all’Eurovision pur non essendo in Europa?'],
    options: [
      'Perché ha vinto un contest speciale',
      'Perché è membro EBU associato',
      'Perché ospiterà l’evento nel 2030',
      'Perché confina tecnicamente con Cipro'
    ],
    correctIndex: 1,
  },
  {
    id: 'g3',
    type: 'general',
    text: ['Quale lingua è stata usata più spesso nelle canzoni vincitrici?'],
    options: ['Francese', 'Italiano', 'Spagnolo', 'Inglese'],
    correctIndex: 3,
  },
  {
    id: 'g4',
    type: 'general',
    text: ['Quale paese ha organizzato più edizioni dell’Eurovision?'],
    options: ['Germania', 'Regno Unito', 'Francia', 'Italia'],
    correctIndex: 1,
  }
];

export function getRandomQuestions(): Question[] {
  const shuffledSongs = [...songQuestionsPool].sort(() => 0.5 - Math.random());
  const selectedSongs = shuffledSongs.slice(0, 4);

  const shuffledGeneral = [...generalQuestionsPool].sort(() => 0.5 - Math.random());
  const selectedGeneral = shuffledGeneral.slice(0, 2);

  return [...selectedSongs, ...selectedGeneral];
}
