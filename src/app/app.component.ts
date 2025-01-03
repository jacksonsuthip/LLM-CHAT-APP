import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { CommonModule } from '@angular/common';  // Import CommonModule
import { HttpClientModule } from '@angular/common/http';  // Import HttpClientModule
import { ChatService } from './chat.service';   // Import the ChatService

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [ FormsModule, CommonModule, HttpClientModule],  // Add HttpClientModule here
  providers: [ChatService]  // Explicitly state that services like HttpClient should be available
})
export class AppComponent implements OnInit {
  chatHistory: any[] = [];
  chatHistoryLLM: any[] = [];
  model: string = 'llama3.2:1b';
  temperature: number = 0; 
  isProcessing: boolean = false;
  userInput: string = "";

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    const storedHistory = localStorage.getItem('chatHistory');
    if (storedHistory) {
      this.chatHistory = JSON.parse(storedHistory);
    }
  }

  deleteChatHistory(): void {
    this.chatHistory = [];
    localStorage.removeItem('chatHistory');
  }

  sendMessage(): void {
    if (!this.model || !this.userInput) return;  // Ensure input and option are selected

    // Add user's message to chat history
    const userMessage = { User: this.userInput, Assistant: '', Role: "User" };
    this.chatHistory.push(userMessage);
    
    // Prepare the request body for the API call
    const requestBody = {
      history: this.chatHistoryLLM,
      query: this.userInput,
      model: this.model,
      temperature: this.temperature
    };

    this.isProcessing = true;
    this.userInput = '';

    // Call the ChatService to send the request to the server
    this.chatService.sendMessageToBot(requestBody).subscribe({
      next: (response) => {
        // Add assistant's response to chat history
        this.chatHistory.push({ User: '', Assistant: response.answer, Role: "Assistant" });
        this.chatHistoryLLM.push({User: response.input, Assistant: response.answer})

        // Save the updated chat history to localStorage
        localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));

        // Reset the input and stop the loading indicator
        this.userInput = '';
        this.isProcessing = false;
      },
      error: (error) => {
        console.error('Error sending message to bot:', error);
        this.isProcessing = false;
      }
    });
  }
}
