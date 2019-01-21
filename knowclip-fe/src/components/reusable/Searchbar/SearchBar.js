import React, { Component } from 'react';
import './styles.css';

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            suggestions: []
        };
    }

    setSearch(value) {
        if (!this.props.data || !value) {
            this.setState({ 
                searchValue: value,
                suggestions: []
            });
            return;
        }
        const suggestions = this.props.data.filter((data) => {
            const length = value.length;
            return data.name.slice(0, length).toLowerCase() === value.toLowerCase();
        });
        this.setState({
            searchValue: value,
            suggestions
        });
    }

    renderSuggestions() {
        if (this.state.suggestions.length === 0) {
            return <div />;
        }
        const suggestions = this.state.suggestions.map((suggestion) => {
            return (
                <div 
                    key={suggestion.name}
                    className='hoverOption'
                    style={{
                        borderBottomStyle: 'solid',
                        borderBottomWidth: '1px',
                        borderBottomColor: '#ccc',
                        padding: '10px'
                    }}
                    onClick={() => {
                        this.setState({ suggestions: [], searchValue: '' });
                        this.props.onClickItem(suggestion)
                    }}
                >
                    <p style={{ margin: '0px' }}>{suggestion.name}</p>
                </div>
            )
        });
        return (
            <div
                style={{
                    zIndex: '100',
                    position: 'absolute', 
                    top: '37px',
                    width: '100%'
                }}
            >
                { suggestions }
            </div>
        )
    }

    render() {
        return (
            <div 
                style={{
                    position: 'relative',
                    width: '50%',
                    display: 'block',
                }}
            >
                { 
                    this.props.label &&
                    <p style={{ marginBottom: '10px', fontSize: '14px', color: '#ddd' }}> 
                        { this.props.label }
                    </p>
                }
                <input
                    style={{ 
                        marginBottom: '0px',
                        width: '100%',
                        borderStyle: 'none',
                        borderRadius: '0px',
                    }}
                    type='text'
                    value={this.state.searchValue}
                    onChange={(e) => this.setSearch(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.keyCode === 13) {
                            this.setState({ suggestions: [], searchValue: '' });                            
                            this.props.onClickItem({ name: this.state.searchValue });
                        }
                    }}
                    placeholder={this.props.placeholder}
                />
                {
                    this.state.suggestions &&
                    this.state.suggestions.length > 0 &&
                    <div 
                        style={{ width: '100vw', height: '100vh', position: 'absolute', opacity: '0' }}
                        onClick={() => this.setState({ suggestions: [] })}
                    />
                }
                { this.renderSuggestions() }
            </div>
        );
    }
}

export default SearchBar;