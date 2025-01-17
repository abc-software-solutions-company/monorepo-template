import { Command, Plugin, toWidget, toWidgetEditable, Widget, ButtonView, ContextualBalloon, ToolbarView } from 'ckeditor5';

class AddColumnCommand extends Command {
  override execute() {
    const editor = this.editor;
    const model = editor.model;
    const document = model.document;

    model.change(writer => {
      const selection = document.selection;

      const column = selection?.getFirstPosition()?.parent.parent;

      if (column?.name === 'column') {
        const newColumn = writer.createElement('column');

        writer.appendElement('paragraph', newColumn);

        writer.insert(newColumn, writer.createPositionAfter(column));

        writer.setSelection(newColumn, 'in');
      }
    });
  }
}

class RemoveColumnCommand extends Command {
  override execute() {
    const editor = this.editor;
    const model = editor.model;
    const document = model.document;

    model.change(writer => {
      const selection = document.selection;
      const column = selection?.getFirstPosition()?.parent.parent;
      const paragraph = selection?.getFirstPosition()?.parent;

      if (column?.name === 'column') {
        if (paragraph?.isEmpty && column?.childCount <= 1) {
          writer.remove(column);
        } else {
          console.log('Column is not empty. Cannot remove.');
        }
      }
    });
  }
}

class InsertLayoutCommand extends Command {
  override execute() {
    const editor = this.editor;
    const model = editor.model;

    return model.change(writer => {
      const simpleBox = writer.createElement('layout');
      const column1 = writer.createElement('column');
      const column2 = writer.createElement('column');
      const column3 = writer.createElement('column');

      writer.append(column1, simpleBox);
      writer.append(column2, simpleBox);
      writer.append(column3, simpleBox);

      writer.appendElement('paragraph', column1);
      writer.appendElement('paragraph', column2);
      writer.appendElement('paragraph', column3);
      editor.model.insertObject(simpleBox);
    });
  }
}

class LayoutManagerEditing extends Plugin {
  static get requires() {
    return [Widget];
  }

  init() {
    const editor = this.editor;

    editor.model.schema.register('layout', {
      isObject: true,
      allowWhere: '$block',
      allowContentOf: '$root',
      allowAttributes: ['class'],
    });

    editor.model.schema.register('column', {
      isLimit: true,
      allowIn: 'layout',
      allowContentOf: '$root',
      allowAttributes: ['class'],
    });

    editor.conversion.for('upcast').elementToElement({
      view: {
        name: 'div',
        classes: ['columns'],
      },
      model: 'layout',
    });

    editor.conversion.for('dataDowncast').elementToElement({
      view: {
        name: 'div',
        classes: ['columns'],
      },
      model: 'layout',
    });

    editor.conversion.for('upcast').elementToElement({
      view: {
        name: 'div',
        classes: ['column'],
      },
      model: 'column',
    });

    editor.conversion.for('dataDowncast').elementToElement({
      view: {
        name: 'div',
        classes: ['column'],
      },
      model: 'column',
    });

    editor.conversion.for('editingDowncast').elementToElement({
      model: 'layout',
      view: (_modelElement, viewWriter) => {
        const container = viewWriter.writer.createContainerElement('div', { class: 'columns' });
        return toWidget(container, viewWriter.writer, { label: 'custom block widget' });
      },
    });

    editor.conversion.for('editingDowncast').elementToElement({
      model: 'column',
      view: (_modelElement, viewWriter) => {
        const column = viewWriter.writer.createEditableElement('paragraph', { class: 'column' });
        return toWidgetEditable(column, viewWriter.writer);
      },
    });
  }
}

export default class LayoutManager extends Plugin {
  static get requires() {
    return [LayoutManagerEditing];
  }

  init() {
    const editor = this.editor;

    editor.ui.componentFactory.add('insertLayout', locale => {
      const view = new ButtonView(locale);
      view.set({
        label: 'Insert Layout',
        tooltip: true,
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
				<path fill-rule="evenodd" clip-rule="evenodd" d="M1.39825 1.39874C1.86709 0.929896 2.50297 0.666504 3.16602 0.666504H14.8327C15.4957 0.666504 16.1316 0.929896 16.6005 1.39874C17.0693 1.86758 17.3327 2.50346 17.3327 3.1665V14.8332C17.3327 15.4962 17.0693 16.1321 16.6005 16.6009C16.1316 17.0698 15.4957 17.3332 14.8327 17.3332H3.16602C2.50297 17.3332 1.86709 17.0698 1.39825 16.6009C0.929408 16.1321 0.666016 15.4962 0.666016 14.8332V3.1665C0.666016 2.50346 0.929408 1.86758 1.39825 1.39874ZM3.16602 2.33317C2.945 2.33317 2.73304 2.42097 2.57676 2.57725C2.42048 2.73353 2.33268 2.94549 2.33268 3.1665V14.8332C2.33268 15.0542 2.42048 15.2661 2.57676 15.4224C2.73304 15.5787 2.945 15.6665 3.16602 15.6665H8.16602V2.33317H3.16602ZM9.83268 2.33317V15.6665H14.8327C15.0537 15.6665 15.2657 15.5787 15.4219 15.4224C15.5782 15.2661 15.666 15.0542 15.666 14.8332V3.1665C15.666 2.94549 15.5782 2.73353 15.4219 2.57725C15.2657 2.42097 15.0537 2.33317 14.8327 2.33317H9.83268Z" fill="#1B1D21"/>
				</svg>`,
      });

      view.on('execute', () => {
        editor.execute('insertLayout');
        editor.editing.view.focus();
      });

      return view;
    });

    editor.ui.componentFactory.add('addColumn', locale => {
      const view = new ButtonView(locale);
      view.set({
        label: 'Add Column',
        withText: true,
        tooltip: true,
      });

      view.on('execute', () => {
        editor.execute('addColumn');
        editor.editing.view.focus();
      });

      return view;
    });

    editor.commands.add('insertLayout', new InsertLayoutCommand(editor));
    editor.commands.add('addColumn', new AddColumnCommand(editor));
    editor.commands.add('removeColumn', new RemoveColumnCommand(editor));

    // Listen to the Enter key and execute the command
    editor.keystrokes.set('shift+enter', (data, cancel) => {
      editor.execute('addColumn');
      cancel();
    });

    // Listen to the Backspace key and remove empty paragraphs
    editor.keystrokes.set('Backspace', (data, cancel) => {
      editor.execute('removeColumn');
    });
  }
}
