import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { CommonModule } from '@angular/common';  // Import CommonModule

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [FormsModule, CommonModule]  // Add CommonModule to imports array
})
export class AppComponent implements OnInit {
  chatHistory: any[] = [];
  userInput: string = '';
  isProcessing: boolean = false;

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
    if (!this.userInput.trim()) return;

    this.chatHistory.push({ role: 'user', content: this.userInput });
    this.isProcessing = true;

    // Simulate bot response (you can replace this with actual API integration)
    setTimeout(() => {
      const botResponse = "This is a bot response!";
      this.chatHistory.push({ role: 'assistant', content: botResponse });
      this.isProcessing = false;
      localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
    }, 1500);
  }
}
