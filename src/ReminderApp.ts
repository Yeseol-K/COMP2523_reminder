import readlineSync from "readline-sync";
import Logger from "./util/ReminderLogger";
import RemindersHandler from "./RemindersHandler";

/**
 * @class ReminderApp
 * @description Represents the class that handles the overall logic of the app
 */
export default class ReminderApp {
  private _remindersHandler: RemindersHandler;

  /**
   * Creates a new instance of the reminder application.
   */
  constructor() {
    this._remindersHandler = new RemindersHandler();
  }

  /**
   * Starts application and continually prompts user to choose from one of six menu items.
   */
  public start(): void {
    let exitFlag = false;
    for (;;) {
      const item: string = ReminderApp.handleMenuSelection();
      switch (item) {
        case "1":
          this.handleShowReminders();
          break;

        case "2":
          this.handleSearchReminders();
          break;

        case "3":
          this.handleAddReminder();
          break;

        case "4":
          this.handleModifyReminders();
          break;

        case "5":
          this.handleToggleCompletion();
          break;

        default:
          exitFlag = true;
          break;
      }
      if (exitFlag) break;
    }
    Logger.log("\n  ❌  Exited application\n");
  }

  /**
   * Interfaces with user to toggle completion status of a specific reminder.
   */
  private handleToggleCompletion(): void {
    const grouped = this._remindersHandler.groupByTag();
    if(Object.keys(grouped).length === 0) {
      Logger.log('\n  ⚠️  You have no reminders');
      return;
    } 
    Logger.logReminders(this._remindersHandler.reminders);

    const userChoice = this.getUserChoice("reminder number", true);
    this._remindersHandler.toggleCompletion(Number(userChoice) - 1);
    Logger.log('\n  🏁   Reminder Completion Toggled');
    /*
            Pseudocode:
            If no reminders then -> Logger.log('\n  ⚠️  You have no reminders');
            otherwise
            ( 1 ) Display all reminders (Logger.logReminders)
            ( 2 ) Ask User to choose a reminder number to toggle (this.getUserChoice)
            ( 3 ) Take result from ( 2 ) and toggle that reminder's completion (this._remindersHandler.toggleCompletion)
            ( 4 ) Logger.log('\n  🏁   Reminder Completion Toggled');
        */
  }

  /**
   * Interfaces with user to modify a specific reminder.
   */
  private handleModifyReminders(): void {
    const grouped = this._remindersHandler.groupByTag();
    if (Object.keys(grouped).length === 0) {
      Logger.log('\n  ⚠️  You have no reminders');
      return;
    }
    Logger.logReminders(this._remindersHandler.reminders);
    const newNum = this.getUserChoice("number you want edit", false);
    const newDes = this.getUserChoice("description", false);
    this._remindersHandler.modifyReminder(Number(newNum) - 1 , newDes);
    if(ReminderApp.checkUserToggleChoice()) {
      this._remindersHandler.toggleCompletion(Number(newNum) - 1);
    }
    Logger.log('\n  🏁   Reminder Modified');
    /*
            Pseudocode:
            If no reminders then -> Logger.log('\n  ⚠️  You have no reminders');
            otherwise
            ( 1 ) Display all reminders (Logger.logReminders)
            ( 2 ) Ask User to choose a reminder number to edit (this.getUserChoice)
            ( 3 ) Ask User for new reminder description (this.getUserChoice)
            ( 4 ) Take result from ( 2 ) and ( 3 ) and modify reminder (this._remindersHandler.modifyReminder)
            ( 5 ) If user wishes to also toggle reminder status, do so (this._remindersHandler.toggleCompletion)...feeding in ( 2 )
            ( 6 ) Logger.log('\n  🏁   Reminder Modified');
        */
  }

  /**
   * Interfaces with user to add a reminder.
   */
  private handleAddReminder(): void {
    const reminder = this.getUserChoice("reminder", false);
    const tag = this.getUserChoice("tag", false)
    this._remindersHandler.addReminder(reminder, tag);
    Logger.log('\n  🏁  Reminder Added');
    /*
            Pseudocode:
            ( 1 ) Ask User to enter a reminder (description) (this.getUserChoice)
            ( 2 ) Ask User to enter a tag (this.getUserChoice)
            ( 3 ) Take result from ( 1 ) and ( 2 ) and add reminder (this._remindersHandler.addReminder)
            ( 4 ) Logger.log('\n  🏁  Reminder Added');
        */
  }

  /**
   * Finds and logs all reminders with a tag that matches the keyword exactly.
   * If none exists, then all reminders with descriptions that match the search keyword (even partially)
   * are logged instead.
   */
  private handleSearchReminders(): void {
    const grouped = this._remindersHandler.groupByTag();
    if (Object.keys(grouped).length === 0) {
      Logger.log("\n  ⚠️  You have no reminders");
      return;
    }
    const keyword = this.getUserChoice(" ", false);
    Logger.logSearchResults(this._remindersHandler.search(keyword));
    // if(!this._remindersHandler) {
    //   Logger.log('\n  ⚠️  You have no reminders');
    // } {
    //   const keyword = this.getUserChoice(" ", false);

    //   const matches = this.searchTags(keyword);
    //   if(this.searchTags(keyword) === tag) {
    //     Logger.log(matches)
    //   } else {
    //     for (const reminders of this.searchDescriptions(keyword)) {
    //     }
    //   }
    // }
  
    /*
        Pseudocode:
        If no reminders then -> Logger.log('\n  ⚠️  You have no reminders');
        otherwise
        ( 1 ) Ask User to enter a search keyword (this.getUserChoice)
        ( 2 ) Feed to Logger.logSearchResults <- the results of this._remindersHandler.search(keyword)
              BREAKDOWN OF: this._remindersHandler.search(keyword)
              - First call this.searchTags(keyword) to see if you have a matching tag
              - If not, then call this.searchDescriptions(keyword) and look through each
                individual reminder. 
    */
  }

  /**
   * Logs any existing reminders to console, grouped by tags.
   */
  private handleShowReminders(): void {
    const grouped = this._remindersHandler.groupByTag();
    if (Object.keys(grouped).length === 0) {
      Logger.log("\n  ⚠️  You have no reminders");
      return;
    }
    Logger.logGroupedReminders(this._remindersHandler.groupByTag());
    /*
        Pseudocode:
        If no reminders then -> Logger.log('\n  ⚠️  You have no reminders');
        otherwise
        ( 1 ) Logger.logGroupedReminders(this._remindersHandler.groupByTag());
    */
  }

  /**
   * Returns verified user input based on Main Menu item selected.
   * @param question - Text that describes what to ask the user
   * @param isIndexRequired - True if user chooses to either modify or toggle reminder, otherwise false
   */
  private getUserChoice(question: string, isIndexRequired: boolean): string {
    let userChoice: string;
    for (;;) {
      userChoice = readlineSync.question(`\nEnter a ${question} here: `, {
        limit: (input: string) => {
          return this.validateInput(input, isIndexRequired);
        },
        limitMessage: "",
      });
      const userDecision: string = this.checkUserChoice(question, userChoice);
      if (userDecision === "n") Logger.log("\n  🔄  Please try typing it again");
      else break;
    }
    return userChoice;
  }

  /**
   * Verifies user input and returns 'y' if input is accepted by user, otherwise 'n'.
   * @param question - Portion of question to prompt with, based on Main Menu item selected
   * @param userChoice - Text that user enters
   */
  private checkUserChoice(question: string, userChoice: string): string {
    return readlineSync
      .question(`You entered ${question}: '${userChoice}', is it correct? y/n: `, {
        limit: /^[YNyn]{1}$/,
        limitMessage: "\n  🚨  Invalid input: Please enter either y/n.\n",
      })
      .toLowerCase();
  }

  /**
   * Returns true if the user wishes to toggle the complete status of a reminder, otherwise false.
   */
  private static checkUserToggleChoice(): boolean {
    const toggleAnswer: string = readlineSync.question(`\nDo you wish to toggle the completed status? y/n: `, {
      limit: /^[YNyn]{1}$/,
      limitMessage: "\n  🚨  Invalid input: Please enter either y/n.\n",
    });

    if (toggleAnswer.toLowerCase() === "y") return true;
    return false;
  }

  /**
   * Validates if user's input is valid for the selected menu item.
   * @param input - The text the user enters
   * @param isIndexRequired - True if user chooses to either modify or toggle reminder, otherwise false
   */
  private validateInput(input: string, isIndexRequired: boolean): boolean {
    if (!input) {
      Logger.log(`\n  🚨  Input cannot be blank: Please try again.\n`);
      return false;
    }
    if (isIndexRequired) {
      if (ReminderApp.matches(/^\d+$/, input)) {
        const index: number = Number(input) - 1;
        if (this._remindersHandler.isIndexValid(index)) return true;
        Logger.log(`\n  🚨  Input must be number from the list of reminders: Please try again.\n`);
        return false;
      }
      Logger.log(`\n  🚨  Input must be positive number from the list of reminders: Please try again.\n`);
      return false;
    }
    return true;
  }

  /**
   * Returns true if text matches the RegExp pattern, otherwise false.
   * @param regex - Pattern used to match text
   * @param str - Text to match
   */
  private static matches(regex: RegExp, str: string): boolean {
    return regex.test(str);
  }

  /**
   * Returns the menu item number that the user selects.
   * Keeps prompting user until item is valid (between 1 and 6 inclusive).
   */
  private static getMenuItem(): string {
    const item: string = readlineSync.question("Choose a [Number] followed by [Enter]: ", {
      limit: ["1", "2", "3", "4", "5", "6"],
      limitMessage: "\n  🚨  Sorry, input is not a valid menu item.\n",
    });
    return item;
  }

  /**
   * Prompts user to return to Main Menu.
   */
  private static handleMenuSelection(): string {
    readlineSync.question("\nHit [Enter] key to see main menu: ", { hideEchoBack: true, mask: "" });
    Logger.logMenu();
    return ReminderApp.getMenuItem();
  }
}
