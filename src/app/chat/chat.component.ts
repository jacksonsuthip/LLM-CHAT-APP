import { ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChatService } from '../chat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnChanges {
  chatHistory: any[] = [];
  chatHistoryLLM: any[] = [];
  model: string = 'llama3.2:1b';
  temperature: number = 0;
  isProcessing: boolean = false;
  userInput: string = "";
  streamedResponse: string = "";

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.deleteChatHistory()
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("ngOnChanges")
    if (changes['someKey']) {
      console.log(changes)
    }
  }

  resetChat() {
    const storedHistory = localStorage.getItem('chatHistory');
    if (storedHistory) {
      this.chatHistory = JSON.parse(storedHistory);
    }
  }

  deleteChatHistory(): void {
    this.chatHistory = [];
    this.chatHistoryLLM = [];
    localStorage.removeItem('chatHistory');
  }

  sendMessage(): void {
    if (!this.model || !this.userInput) return;
    let assistantResponse = "";

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

    const eventSource = new EventSource(`http://127.0.0.1:8000/chat/query_url_stream/${encodeURIComponent(requestBody.query)}/${encodeURIComponent(requestBody.model)}/${encodeURIComponent(requestBody.temperature)}`);

    eventSource.onmessage = (event) => {

      console.log(event.data);

      if (assistantResponse === "") {
        assistantResponse += event.data;
        this.chatHistory.push({ User: '', Assistant: assistantResponse, Role: "Assistant" });
      } else {
        assistantResponse += event.data;
        this.chatHistory[this.chatHistory.length - 1].Assistant = assistantResponse;
      }

      this.isProcessing = false;

      if (event.data.includes('END_OF_MESSAGE')) {
        assistantResponse = "";
      }

      this.cdRef.detectChanges();
    };

    // Handle errors
    eventSource.onerror = (error) => {
      console.error('Error in SSE connection', error);
      assistantResponse = "";
      eventSource.close();
      this.isProcessing = false;
    };
    // // Call the ChatService to send the request to the server
    // this.chatService.sendMessageToBot(requestBody).subscribe({
    //   next: (response) => {
    //     // Add assistant's response to chat history
    //     this.chatHistory.push({ User: '', Assistant: response.answer, Role: "Assistant" });
    //     this.chatHistoryLLM.push({ User: response.input, Assistant: response.answer })

    //     // Save the updated chat history to localStorage
    //     localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));

    //     // Reset the input and stop the loading indicator
    //     this.userInput = '';
    //     this.isProcessing = false;
    //   },
    //   error: (error) => {
    //     console.error('Error sending message to bot:', error);
    //     this.isProcessing = false;
    //   }
    // });

  }


}
