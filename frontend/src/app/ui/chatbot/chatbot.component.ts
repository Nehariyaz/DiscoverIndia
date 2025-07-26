import { Component, Output, EventEmitter } from '@angular/core';
import { RecommendationService } from '../../services/recommendations.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
})
export class ChatbotComponent {
  userInput = '';
  messages: { sender: 'user' | 'bot'; text: string }[] = [];
  recommendations: any[] = [];
  step = 0;
  loading = false;

  collectedData: any = {
    hasStateInMind: null,
    selectedState: null,
    experienceType: null,
    travelType: null,
    budget: null,
    activity: '',
    interestedActivities: [],
    season: null,
  };

  @Output() formFilled = new EventEmitter<any>();

  constructor(private recommendationService: RecommendationService) {
    this.startConversation();
  }

  startConversation() {
    this.messages = [];
    this.messages.push({ sender: 'bot', text: '👋 Hi! I can help you find travel destinations.' });
    this.messages.push({ sender: 'bot', text: 'Do you already have a state in mind? (yes/no)' });
    this.step = 0;
  }

  sendMessage() {
    const input = this.userInput.trim();
    if (!input) return;
    this.messages.push({ sender: 'user', text: input });
    this.userInput = '';
    this.handleStep(input.trim().toLowerCase());
  }

  handleStep(input: string) {
    switch (this.step) {
      case 0:
        if (input === 'yes') {
          this.collectedData.hasStateInMind = true;
          this.messages.push({ sender: 'bot', text: 'Which state are you thinking of?' });
          this.step = 1;
        } else if (input === 'no') {
          this.collectedData.hasStateInMind = false;
          this.messages.push({
            sender: 'bot',
            text: 'What kind of experience are you looking for? (e.g., adventure, beach, spiritual, culture...)',
          });
          this.step = 2;
        } else {
          this.messages.push({ sender: 'bot', text: 'Please answer with "yes" or "no".' });
        }
        break;

      case 1:
        this.collectedData.selectedState = input;
        this.messages.push({
          sender: 'bot',
          text: 'What kind of experience are you looking for? (e.g., adventure, beach, spiritual, culture...)',
        });
        this.step = 3;
        break;

      case 2:
        this.collectedData.experienceType = input;
        this.collectedData.activity = input;
        this.messages.push({ sender: 'bot', text: `Let me suggest states great for ${input}...` });

        this.loading = true;
        this.recommendationService.getStatesByExperience(input).subscribe({
          next: (states) => {
            this.loading = false;
            if (states.length === 0) {
              this.messages.push({ sender: 'bot', text: `Sorry, I couldn’t find matching states.` });
            } else {
              const names = states.map((s: any) => s.name || s.state || s).slice(0, 5).join(', ');
              this.messages.push({ sender: 'bot', text: `You might enjoy visiting: ${names}` });
            }
            this.messages.push({
              sender: 'bot',
              text: 'Would you like to continue planning your trip? (yes to proceed, or type "restart")',
            });
            this.step = 5;
          },
          error: (err) => {
            this.loading = false;
            console.error('Error fetching states:', err);
            this.messages.push({ sender: 'bot', text: 'Oops! Could not fetch states right now.' });
            this.step = 5;
          },
        });
        break;

      case 3:
        this.collectedData.experienceType = input;
        this.collectedData.activity = input;
        this.messages.push({
        sender: 'bot',
        text: 'What kind of travel are you planning? Choose one: solo, couple, family, group, luxury, backpacking.',
        });
        this.step = 6;
        break;

      case 5:
        if (input === 'yes') {
          this.messages.push({ sender: 'bot', text: 'Great! What kind of travel are you planning? (solo, couple, family)' });
          this.step = 6;
        } else if (input === 'restart') {
          this.restartConversation();
        } else {
          this.messages.push({ sender: 'bot', text: 'Please type "yes" to continue or "restart" to start over.' });
        }
        break;

        case 6:
  const allowedTypes = ['solo', 'couple', 'family', 'group', 'luxury', 'backpacking'];
  if (allowedTypes.includes(input)) {
    this.collectedData.travelType = input;
    this.messages.push({ sender: 'bot', text: 'What’s your budget (INR)? You can enter a range like "5000-8000".' });
    this.step = 7;
  } else {
    this.messages.push({
      sender: 'bot',
      text: '❗ Please choose one from: solo, couple, family, group, luxury, backpacking.',
    });
  }
  break;


      case 7:
        const budget = this.parseBudget(input);
        if (budget) {
          this.collectedData.budget = budget;
          this.messages.push({
            sender: 'bot',
            text: 'Awesome! What kind of activities are you interested in? You can list multiple (e.g., beach, trekking, temple visit)',
          });
          this.step = 8;
        } else {
          this.messages.push({ sender: 'bot', text: 'Please enter a valid budget number or range (e.g., 5000, or 5000-8000).' });
        }
        break;

      case 8:
        const acts = input.split(',').map((s) => s.trim()).filter(Boolean);
        if (acts.length) {
          this.collectedData.activity = acts[0];
          this.collectedData.interestedActivities = acts;
          this.messages.push({ sender: 'bot', text: 'What’s your preferred travel season? (e.g., summer, winter, monsoon)' });
          this.step = 9;
        } else {
          this.messages.push({ sender: 'bot', text: 'Please list at least one activity.' });
        }
        break;

      case 9:
        this.collectedData.season = input;
        this.messages.push({ sender: 'bot', text: '✨ Just a moment… Finding the best matching destinations for you…' });

        const payload = this.buildPayload(true);
        this.loading = true;

        this.recommendationService.getDestinations(payload).subscribe({
          next: (results) => {
            this.loading = false;
            if (results.length) {
              this.recommendations = results;
              const names = results.map((r: any) => r.name).slice(0, 5).join(', ');
              this.messages.push({ sender: 'bot', text: `Here are some great destinations: ${names}` });
            } else {
              this.tryFallbackDestinations();
              return;
            }
            this.emitAndContinue();
          },
          error: (err) => {
            this.loading = false;
            console.error('Main fetch error:', err);
            this.messages.push({ sender: 'bot', text: "Couldn't fetch results. Please try again." });
            this.step = 5;
          },
        });
        break;

      default:
        if (input === 'restart') {
          this.restartConversation();
        } else {
          this.messages.push({ sender: 'bot', text: 'Type "restart" to start again.' });
        }
        break;
    }
  }

  tryFallbackDestinations() {
    const fallback = this.buildPayload(false);
    this.loading = true;
    this.recommendationService.getDestinations(fallback).subscribe({
      next: (fallbackResults) => {
        this.loading = false;
        if (fallbackResults.length) {
          this.recommendations = fallbackResults;
          const names = fallbackResults.map((d: any) => d.name).slice(0, 5).join(', ');
          this.messages.push({ sender: 'bot', text: `Couldn't find exact matches, but you may enjoy: ${names}` });
        } else {
          this.messages.push({ sender: 'bot', text: 'Sorry, no destinations found even after relaxing filters.' });
        }
        this.emitAndContinue();
      },
      error: (err) => {
        console.error('Fallback fetch error:', err);
        this.messages.push({ sender: 'bot', text: 'Even fallback suggestions failed. Try again later.' });
        this.step = 5;
      },
    });
  }

  emitAndContinue() {
    this.formFilled.emit(this.collectedData);
    this.messages.push({
      sender: 'bot',
      text: '✅ Preferences saved! You can review and edit them in the form.',
    });
    this.step = 999;
  }

  restartConversation() {
    this.userInput = '';
    this.recommendations = [];
    this.collectedData = {
      hasStateInMind: null,
      selectedState: null,
      experienceType: null,
      travelType: null,
      budget: null,
      activity: '',
      interestedActivities: [],
      season: null,
    };
    this.loading = false;
    this.startConversation();
  }

  private buildPayload(includeState: boolean): any {
    return {
      state: includeState ? this.collectedData.selectedState ?? null : null,
      travelType: this.collectedData.travelType ?? null,
      budget: this.collectedData.budget ?? null,
      season: this.collectedData.season ?? null,
      interestedActivities: this.collectedData.interestedActivities ?? [],
    };
  }

  private parseBudget(input: string): number | [number, number] | null {
    if (/^\d+$/.test(input)) return parseInt(input);

    const rangeMatch = input.match(/^(\d+)\s*[-to]+\s*(\d+)$/i);
    if (rangeMatch) {
      const min = parseInt(rangeMatch[1]);
      const max = parseInt(rangeMatch[2]);
      if (!isNaN(min) && !isNaN(max) && min < max) {
        return [min, max];
      }
    }
    return null;
  }
}
