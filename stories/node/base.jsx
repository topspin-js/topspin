import { useState } from 'react';
import { TopspinForm, FormState, FIELDS, TEMPLATES, WIDGETS, CLASSNAMES } from '../../src';
import '../../src/styles/styles.css'; // topspin's default styles


export function View({title, description, children}) {
    return (
        <div className="story-view">
            <div className="story-header">
                <h1 className="story-title">{title}</h1>
                {description && <p className="story-description">{description}</p>}
            </div>
            <div className="story-content">
                {children}
            </div>
        </div>
    );
}


export function FormView({schema, data, title, description}) {
    const [formState, setFormState] = useState(FormState.create({schema: schema, data: data}));

    return (
        <View
            title={title}
            description={description}
        >
            <div className="story-col">
                <div>
                    <h4>Schema</h4>
                    <textarea
                        value={JSON.stringify(formState.getSchema(), null, 2)}
                        className="story-textarea"
                        rows={15}
                        disabled={true}
                    />
                </div>
                <hr/>
                <div>
                    <h4>Data</h4>

                    <textarea
                        value={JSON.stringify(formState.getData(), null, 2)}
                        className="story-textarea"
                        rows={15}
                        disabled={true}
                    />
                </div>
            </div>
            <div className="story-col">
                <div>
                    <h4>Form</h4>
                    <TopspinForm
                        formState={formState}
                        onChange={setFormState}
                        fields={FIELDS}
                        templates={TEMPLATES}
                        widgets={WIDGETS}
                        classnames={CLASSNAMES}
                    />
                </div>
            </div>
        </View>
    );
}
