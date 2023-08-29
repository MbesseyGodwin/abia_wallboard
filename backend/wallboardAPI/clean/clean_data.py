import pandas as pd
import system


def read_csv_file(file_path):
    dataframe = pd.read_csv(file_path)
    return dataframe

df = read_csv_file('path/to/your/file.csv')
def clean_data(dataframe):
    # Remove duplicate rows
    dataframe = dataframe.drop_duplicates()

    # Remove rows with missing values
    dataframe = dataframe.dropna()

    # Convert columns to appropriate data types
    dataframe['column1'] = dataframe['column1'].astype(int)
    dataframe['column2'] = dataframe['column2'].astype(float)
    dataframe['column3'] = pd.to_datetime(dataframe['column3'])

    # Remove leading/trailing whitespaces from string columns
    dataframe['column4'] = dataframe['column4'].str.strip()

    # Perform additional cleanup steps as needed...

    return dataframe

def concurrence_analysis(file1, file2):
    # Read the CSV files into pandas DataFrames
    df1 = pd.read_csv(file1)
    df2 = pd.read_csv(file2)

    # Perform concurrence analysis
    common_values = pd.merge(df1, df2, how='inner', on='common_column')

    return common_values

def rename_column(dataframe, old_column_name, new_column_name):
    dataframe.rename(columns={old_column_name: new_column_name}, inplace=True)
    return dataframe

columns =['column1','column2','column3']
def compare_csv_files(file1, file2, columns):
    # Read the CSV files into pandas DataFrames
    df1 = pd.read_csv(file1)
    df2 = pd.read_csv(file2)

    # Perform inner merge based on the specified columns
    merged_df = pd.merge(df1, df2, on=columns, how='inner')

    # Add boolean columns indicating concurrence for each column
    for column in columns:
        merged_df[column + '_Concurrence'] = True

    return merged_df

def calculate_column(dataframe):
    # Perform the calculation and create a new column
    dataframe['new_column'] = dataframe['column1'] + dataframe['column2']

    return dataframe