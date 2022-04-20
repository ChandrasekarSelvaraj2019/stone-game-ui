import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'stone-game-ui';
  data: PitsAndStonesUI = this.resetData();

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    alert("User 1 is playing. Please select a pit");
  }

  public playSelectedPit(index: number, row: number): void {
    if ((row === 0 && !this.data.user1Playing)
      || (row === 1 && this.data.user1Playing)) {
      alert("Please select" + (this.data.user1Playing ? "user 1" : "user 2") + "pits");
      return;
    }
    this.data.inputPitPosition = this.data.user1Playing? (this.data.user1Pits.length - index -1) : index;
    this.http.post<PitsAndStonesUI>('http://localhost:8080/stone-game', this.createDataFromUI()).subscribe(result => {
      this.data = this.copyUpdatedValues(result);
      if(this.isAllElementsAreZero(this.data.user1Pits) || this.isAllElementsAreZero(this.data.user2Pits)) {
        this.announceWinner();
      }
      else {
        alert("Please select pits for" + (this.data.user1Playing ? "user 1" : "user 2"));
      }
    })

  }

  isAllElementsAreZero(userPits: Array<number>): boolean {
    let count = 0;
    for (let i = 0; i < userPits.length; i++) {
        count += userPits[i];
    }
    return count === 0;
  }

  announceWinner() {
    let user1Stones = this.countStones(this.data.user1Pits);
    let user2Stones = this.countStones(this.data.user2Pits);
    if (user1Stones === user2Stones) {
      alert("Game Ended in a Draw");
    } else {
      alert("Game Ended. winner is " + (user1Stones > user2Stones ? "user 1" : "user2"));
    }
    this.resetData();
  }

  countStones(userPits: Array<number>) {
    let count = 0;
    for (let i = 0; i < userPits.length; i++) {
      count += userPits[i];
    }
    return count;
  }

  resetData():PitsAndStonesUI {
    return {
      user1Playing: true,
      user1Pits: [6, 6, 6, 6, 6, 6],
      user2Pits: [6, 6, 6, 6, 6, 6],
      inputPitPosition: 0,
      user1BigPitCount:0,
      user2BigPitCount:0
    }
  }

  createDataFromUI():PitsAndStones {
    let user1Pits = [...this.data.user1Pits].reverse();
    user1Pits.push(this.data.user1BigPitCount);
    let user2Pits = [...this.data.user2Pits];
    user2Pits.push(this.data.user2BigPitCount);
    return {
      user1Playing: this.data.user1Playing,
      user1Pits: [...user1Pits],
      user2Pits: [...user2Pits],
      inputPitPosition: this.data.inputPitPosition
    }
  }

  copyUpdatedValues(result:PitsAndStones):PitsAndStonesUI {
    let user1BigPitValue = result.user1Pits.pop();
    let user2BigPitValue = result.user2Pits.pop();
    return {
      user1Playing: result.user1Playing,
      user1Pits: [...result.user1Pits].reverse(),
      user2Pits: [...result.user2Pits],
      inputPitPosition: result.inputPitPosition,
      user1BigPitCount:user1BigPitValue!,
      user2BigPitCount:user2BigPitValue!
    }
  }

}

interface PitsAndStones {
  user1Playing: boolean;
  user1Pits: Array<number>;
  user2Pits: Array<number>;
  inputPitPosition: number;
}

interface PitsAndStonesUI {
  user1Playing: boolean;
  user1Pits: Array<number>;
  user2Pits: Array<number>;
  inputPitPosition: number;
  user1BigPitCount:number;
  user2BigPitCount:number;
}
