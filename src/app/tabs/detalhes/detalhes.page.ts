import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalhes',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './detalhes.page.html',
  styleUrls: ['./detalhes.page.scss']
})
export class DetalhesPage implements OnInit {
  id!: string;
  pokemon: any;
  description: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.carregarDetalhes();
  }

  async carregarDetalhes() {
    const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${this.id}`);
    const pokemon = await pokeRes.json();

    const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${this.id}`);
    const species = await speciesRes.json();

    const entry = species.flavor_text_entries.find((e: any) => e.language.name === 'pt') ||
                  species.flavor_text_entries.find((e: any) => e.language.name === 'en');

    this.pokemon = {
      id: pokemon.id,
      name: this.capitalize(pokemon.name),
      image: pokemon.sprites.other['official-artwork'].front_default,
      types: pokemon.types.map((t: any) => this.translateType(t.type.name)),
      height: pokemon.height,
      weight: pokemon.weight,
      abilities: pokemon.abilities.map((a: any) => this.translateAbility(a.ability.name))
    };

    this.description = entry?.flavor_text.replace(/\f|\n|\r/g, ' ') || 'Descrição não disponível.';
  }

  voltar() {
    this.router.navigate(['/tabs/tab1']);
  }

  translateType(type: string): string {
    const map: { [key: string]: string } = {
      fire: 'Fogo', water: 'Água', grass: 'Grama', poison: 'Tóxico',
      electric: 'Elétrico', flying: 'Voo', bug: 'Inseto', normal: 'Normal',
      ground: 'Terra', fairy: 'Fada', fighting: 'Lutador', psychic: 'Psíquico',
      rock: 'Pedra', ghost: 'Fantasma', ice: 'Gelo', dragon: 'Dragão',
      dark: 'Sombrio', steel: 'Aço'
    };
    return map[type] || this.capitalize(type);
  }

  translateAbility(ability: string): string {
    const map: { [key: string]: string } = {
      overgrow: 'Exuberância',
      chlorophyll: 'Clorofila',
      blaze: 'Chama',
      torrent: 'Torrente',
      shield_dust: 'Pó de Escudo',
      run_away: 'Fuga',
      // adicione mais se quiser
    };
    return map[ability] || this.capitalize(ability);
  }

  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
