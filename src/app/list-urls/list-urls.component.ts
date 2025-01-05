import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-list-urls',
  standalone: true,
  imports: [FormsModule, CommonModule],  // Import FormsModule for ngModel
  templateUrl: './list-urls.component.html',
  styleUrls: ['./list-urls.component.scss']
})
export class ListUrlsComponent implements OnInit {
  isProcessing: boolean = false
  urls: any[] = [];
  newUrl: string = '';
  subUrl: false = false;

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.listUrls();
  }

  addUrl(): void {
    this.isProcessing = true;
    this.chatService.addUrl({
      urls: [
        this.newUrl
      ],
      subUrl: this.subUrl
    }).subscribe({
      next: (response) => {
        this.newUrl = '';
        this.isProcessing = false;
        this.listUrls();
        console.log(response)
      },
      error: (error) => {
        console.log(error)
        this.listUrls();
        this.isProcessing = false;
      }
    });
  }

  deleteUrl(index: number): void {
    this.urls.splice(index, 1);
    this.chatService.deleteUrl({
      url: this.urls[index].source
    }).subscribe({
      next: (response) => {
        console.log(response)
      },
      error: (error) => {
        console.log(error)
      }
    });
  }

  listUrls(): void {
    this.chatService.listUrls().subscribe({
      next: (response) => {
        this.urls = response || []
        console.log(response)
      },
      error: (error) => {
        console.log(error)
      }
    });
  }
}
