import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  standalone: true,
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  imports: [
    IonicModule,
    CommonModule
  ]
})
export class Tab1Page implements OnInit {
  pokemons: any[] = [];
  offset = 0;

  constructor(
    private pokemonService: PokemonService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadMore();
  }

  loadMore() {
    this.pokemonService.getPokemonList(this.offset).subscribe(async (res: any) => {
      const results = await Promise.all(res.results.map(async (p: any) => {
        const id = p.url.split('/')[6];

        const detail = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(r => r.json());
        const types = detail.types.map((t: any) => capitalize(t.type.name));
        const image = detail.sprites.other['official-artwork'].front_default || detail.sprites.front_default;

        const species = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then(r => r.json());
        const entry = species.flavor_text_entries.find((e: any) => e.language.name === 'pt') ||
                      species.flavor_text_entries.find((e: any) => e.language.name === 'en');
        const description = entry ? entry.flavor_text.replace(/\f|\n|\r/g, ' ') : 'Descrição não disponível.';

        return {
          id: `#${id}`,
          name: capitalize(p.name),
          image,
          types,
          description,
          color: getColorByType(types[0]?.toLowerCase())
        };
      }));

      this.pokemons.push(...results);
      this.offset += 20;
    });
  }

  abrirDetalhes(id: string) {
    this.router.navigate([`/tabs/detalhes`, id]);
  }

  getTranslatedType(type: string): string {
    const translations: { [key: string]: string } = {
      fire: 'Fogo',
      water: 'Água',
      grass: 'Grama',
      poison: 'Tóxico',
      electric: 'Elétrico',
      flying: 'Voo',
      bug: 'Inseto',
      normal: 'Normal',
      ground: 'Terra',
      fairy: 'Fada',
      fighting: 'Lutador',
      psychic: 'Psíquico',
      rock: 'Pedra',
      ghost: 'Fantasma',
      ice: 'Gelo',
      dragon: 'Dragão',
      dark: 'Sombrio',
      steel: 'Aço'
    };
    return translations[type.toLowerCase()] || type;
  }
}

function getColorByType(type: string): string {
  const colors: any = {
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    poison: '#A040A0',
    electric: '#F8D030',
    flying: '#A890F0',
    bug: '#A8B820',
    normal: '#A8A878',
    ground: '#E0C068',
    fairy: '#EE99AC',
    fighting: '#C03028',
    psychic: '#F85888',
    rock: '#B8A038',
    ghost: '#705898',
    ice: '#98D8D8',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0'
  };
  return colors[type] || '#A8A878';
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
